import { Injectable, UnauthorizedException } from '@nestjs/common';
import { baseSelect, BaseService } from 'src/core/base.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signin.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  defaultSelect: Prisma.UserSelect = {
    ...baseSelect,
    username: true,
    email: true,
  };

  constructor(
    readonly prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async validate(dto: SignInDto) {
    const user = await this.userService.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(
        'Wrong email or password. Try again or click Forgot password to reset it.',
      );
    }

    try {
      const isMatched = await argon.verify(user.password, dto.password);
      if (!isMatched) {
        throw new UnauthorizedException(
          'Wrong email or password. Try again or click Forgot password to reset it.',
        );
      }
    } catch (err) {
      throw new UnauthorizedException(
        'Wrong email or password. Try again or click Forgot password to reset it.',
      );
    }

    const accessToken = await this.getJwtToken(user.email, user.id);
    const expiration =
      Number(this.config.get('JWT_ACCESS_TOKEN_EXP_IN_SECOND')) || 86400;

    return {
      user: { ...user, password: undefined },
      token: { access: accessToken, expiration },
    };
  }

  async verify(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: this.defaultSelect,
    });

    return { ...user, password: undefined };
  }

  private async getJwtToken(email: string, userId: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const jwtTokenSecret = this.config.get('JWT_ACCESS_TOKEN_SECRET');
    const jwtTokenExp = `${this.config.get('JWT_ACCESS_TOKEN_EXP_IN_SECOND') || 86400}s`;

    return this.jwt.signAsync(payload, {
      expiresIn: jwtTokenExp,
      secret: jwtTokenSecret,
    });
  }
}
