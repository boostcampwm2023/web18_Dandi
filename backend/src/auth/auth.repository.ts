import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { REFRESH_TOKEN_EXPIRE_DATE } from './utils/auth.constant';
import { v4 as uuidv4 } from 'uuid';

export class AuthRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  setRefreshToken(accessToken: string): void {
    const refreshToken = uuidv4();
    this.redis.set(accessToken, refreshToken, 'EX', REFRESH_TOKEN_EXPIRE_DATE);
  }

  async getRefreshToken(userId: string): Promise<string> {
    return await this.redis.get(userId);
  }
}
