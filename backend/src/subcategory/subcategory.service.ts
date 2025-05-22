import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { baseSelect, BaseService } from 'src/core/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubcategoryService extends BaseService {
  defaultSelect: Prisma.SubcategorySelect = {
    ...baseSelect,
    name: true,
    description: true,
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    products: {
      select: {
        id: true,
        name: true,
        price: true,
      },
    },
  };
  defaultSearchFields?: string[] = ['name'];

  constructor(private readonly prisma: PrismaService) {
    super(prisma.subcategory);
  }

  override async create(dto: CreateSubcategoryDto) {
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

    return await this.prisma.subcategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.categoryId ? { connect: { id: dto.categoryId } } : null,
      },
      select: this.defaultSelect,
    });
  }

  override async update(id: string, dto: UpdateSubcategoryDto) {
    const subcategory = await this.prisma.subcategory.findUnique({
      where: { id },
    });

    if (!subcategory) {
      throw new BadRequestException(
        `The subcategory with id: ${id} does not exist or has been removed`,
      );
    }

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

    return await this.prisma.subcategory.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.categoryId ? { connect: { id: dto.categoryId } } : null,
      },
    });
  }
}
