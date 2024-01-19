import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { REFRESH_TOKEN_EXPIRE_DATE } from './utils/auth.constant';
import { v4 as uuidv4 } from 'uuid';

export class AuthRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setRefreshToken(accessToken: string) {
    const refreshToken = uuidv4();
    this.redis.set(accessToken, refreshToken, 'EX', REFRESH_TOKEN_EXPIRE_DATE);
  }

  getRefreshToken(accessToken: string) {
    return this.redis.get(accessToken);
  }

  removeRefreshToken(accessToken: string) {
    this.redis.del(accessToken);
  }
}
