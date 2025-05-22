import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtAuthStrategy, LocalStrategy } from 'src/auth/strategies';

@Module({
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    JwtAuthStrategy,
    JwtService,
    LocalStrategy,
  ],
})
export class AuthModule {}
