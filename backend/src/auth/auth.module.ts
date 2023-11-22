import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { JwtAuthStrategy } from './strategy/jwtAuth.strategy';
import { JWT_EXPIRE_DATE } from './utils/auth.constant';
import { UsersModule } from 'src/users/users.module';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRE_DATE,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtAuthStrategy],
})
export class AuthModule {}
