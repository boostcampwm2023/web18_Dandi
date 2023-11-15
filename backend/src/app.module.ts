import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redisConfig } from './configs/redis.config';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(typeORMConfig), RedisModule.forRoot({config: redisConfig})],
  controllers: [],
  providers: [],
})
export class AppModule {}
