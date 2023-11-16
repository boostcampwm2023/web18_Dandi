import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT } from '../utils/jwt.type';
import { JWT_EXPIRED_ERROR, JWT_EXPIRE_DATE } from '../utils/auth.constant';
import { cookieExtractor } from '../strategy/jwtAuth.strategy';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { redisConfig } from 'src/configs/redis.config';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT) {
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const userJwt = cookieExtractor(request);

    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRE_DATE,
      },
    });

    // jwt있는 경우
    if (userJwt !== null) {
      try {
        jwtService.verify(userJwt);
      } catch (err) {
        if (err.name === JWT_EXPIRED_ERROR) {
          // refresh token 확인
          const payload = jwtService.decode(userJwt);
          const redis = new Redis(redisConfig);
          const refreshTokenData = await redis.get(payload.id);

          if (refreshTokenData !== null) {
            // 해당 에러 반환 시 client에서 '/refresh_token'으로 요청 보내기로 함
            throw new UnauthorizedException('Access Token is Expired');
          }
        }
      }
    }

    return super.canActivate(context);
  }
}
