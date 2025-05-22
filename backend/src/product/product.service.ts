import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { baseSelect, BaseService } from 'src/core/base.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { connect } from 'http2';
import { CreateProductLikeDto } from 'src/product_like/dto/create-product_like.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheInterceptor } from 'src/core/interceptor/cache.interceptor';

@Injectable()
export class ProductService extends BaseService {
  defaultSelect: Prisma.ProductSelect = {
    ...baseSelect,
    name: true,
    price: true,
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    subcategory: {
      select: {
        id: true,
        name: true,
      },
    },
  };
  defaultSearchFields?: string[] = ['name'];

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheInterceptor,
  ) {
    super(prisma.product);
  }

  private async validate(dto: CreateProductDto | UpdateProductDto) {
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new BadRequestException(
          `The category with id: ${dto.categoryId} does not exist or has been removed`,
        );
      }
    }

    if (dto.subcategoryId) {
      const subcategory = await this.prisma.subcategory.findUnique({
        where: { id: dto.subcategoryId },
      });

      if (!subcategory) {
        throw new BadRequestException(
          `The subcategory with id: ${dto.subcategoryId} does not exist or has been removed`,
        );
      }

      if (subcategory.categoryId !== dto.categoryId) {
        throw new BadRequestException(
          `Subcategory with id: ${dto.subcategoryId} does not belong to the selected category.`,
        );
      }
    }
  }

  override async create(dto: CreateProductDto): Promise<any> {
    // Validate the input data
    await this.validate(dto as CreateProductDto);

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        categoryId: dto.categoryId?.trim() ? dto.categoryId : null,
        subcategoryId: dto.subcategoryId?.trim() ? dto.subcategoryId : null,
      },
      select: this.defaultSelect,
    });

    return product;
  }

  override async update(id: string, dto: UpdateProductDto): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
    if (!product) {
      throw new BadRequestException(`Product with id: ${id} does not exist`);
    }

    await this.validate(dto as UpdateProductDto);

    const update_product = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        price: dto.price,
        categoryId: dto.categoryId?.trim() ? dto.categoryId : null,
        subcategoryId: dto.subcategoryId?.trim() ? dto.subcategoryId : null,
      },
      select: this.defaultSelect,
    });

    return update_product;
  }

  override async remove(id: string): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
    if (!product) {
      throw new BadRequestException(`Product with id: ${id} does not exist`);
    }

    await this.prisma.productLike.deleteMany({
      where: {
        productId: id,
      },
    });

    return await this.prisma.product.delete({ where: { id } });
  }

  async like_feature(id: string, dto: CreateProductLikeDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
    if (!product) {
      throw new BadRequestException(`Product with id: ${id} does not exist`);
    }

    const existing = await this.prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId: dto.userId,
          productId: id,
        },
      },
    });

    if (existing) {
      await this.prisma.productLike.delete({
        where: {
          userId_productId: {
            userId: dto.userId,
            productId: id,
          },
        },
      });
      return { message: 'Unlike' };
    } else {
      await this.prisma.productLike.create({
        data: { userId: dto.userId, productId: id },
      });
      return { message: 'Like' };
    }
  }

  async numberOfLike(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
    if (!product) {
      throw new BadRequestException(`Product with id: ${id} does not exist`);
    }

    const numberOfLike = await this.prisma.productLike.count({
      where: { productId: id },
    });

    return numberOfLike;
  }
}
