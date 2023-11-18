import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { REFRESH_TOKEN_EXPIRE_DATE } from './utils/auth.constant';

export class AuthRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  setRefreshToken(userId: number, socialType: string, refreshToken: string): void {
    const dataForRefresh = { socialType, refreshToken };
    this.redis.set(`${userId}`, JSON.stringify(dataForRefresh), 'EX', REFRESH_TOKEN_EXPIRE_DATE);
  }

  async getRefreshToken(userId: string): Promise<string> {
    return await this.redis.get(userId);
  }
}
