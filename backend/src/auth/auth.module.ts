import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NaverStrategy } from './strategy/naverAuth.strategy';
import { UserRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { JwtAuthStrategy } from './strategy/jwtAuth.strategy';
import { JWT_EXPIRE_DATE } from './utils/auth.constant';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRE_DATE,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, NaverStrategy, JwtAuthStrategy],
})
export class AuthModule {}
