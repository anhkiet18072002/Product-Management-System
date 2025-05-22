import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { baseSelect, BaseService } from 'src/core/base.service';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
@Injectable()
export class UserService extends BaseService {
  defaultSelect: Prisma.UserSelect = {
    ...baseSelect,
    username: true,
    email: true,
    password: true,
    productLikes: {
      select: {
        id: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    },
  };
  defaultSearchFields?: string[] = ['username'];

  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }

  override async create(dto: CreateUserDto): Promise<User> {
    return await super.create({ ...dto, password: await hash(dto.password) });
  }

  override async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.defaultSelect,
    });

    if (!user) {
      throw new BadRequestException(
        `The user with id: ${id} does not exist or has been removed`,
      );
    }

    let { password } = dto;
    if (password) {
      password = await hash(password);
    }

    return await super.update(id, { ...dto, password });
  }

  override async remove(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.defaultSelect,
    });

    if (!user) {
      throw new BadRequestException(
        `The user with id: ${id} does not exist or has been removed`,
      );
    }

    await this.prisma.productLike.deleteMany({
      where: {
        userId: id,
      },
    });

    return await super.remove(id);
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: { ...this.defaultSelect, password: true },
    });

    return user;
  }
}
