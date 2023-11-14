import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NaverStrategy } from './strategy/naverAuth.strategy';
import { UserRepository } from './auth.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository, NaverStrategy],
})
export class AuthModule {}
