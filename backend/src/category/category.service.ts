import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { baseSelect, BaseService } from 'src/core/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService extends BaseService {
  defaultSelect: Prisma.CategorySelect = {
    ...baseSelect,
    name: true,
    description: true,
    subcategories: {
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
    super(prisma.category);
  }
}
