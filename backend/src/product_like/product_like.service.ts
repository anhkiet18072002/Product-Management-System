import { Injectable } from '@nestjs/common';
import { CreateProductLikeDto } from './dto/create-product_like.dto';
import { UpdateProductLikeDto } from './dto/update-product_like.dto';
import { baseSelect, BaseService } from 'src/core/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductLikeService extends BaseService {
  defaultSelect: Prisma.ProductLikeSelect = {
    ...baseSelect,
    product: {
      select: {
        id: true,
        name: true,
        price: true,
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
      },
    },
    user: {
      select: {
        id: true,
        username: true,
        email: true,
      },
    },
  };
  defaultSearchFields?: string[];

  constructor(private readonly prisma: PrismaService) {
    super(prisma.productLike);
  }

  async check_like(dto: CreateProductLikeDto) {
    const existing = await this.prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId: dto.userId,
          productId: dto.productId,
        },
      },
    });

    if (existing) {
      return { message: 'Liked', status: true };
    } else {
      return { message: 'Not Like', status: false };
    }
  }
}
