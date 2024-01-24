import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMDevConfig, typeORMProdConfig, typeORMTestConfig } from './configs/typeorm.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redisConfig, testRedisConfig } from './configs/redis.config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { DiariesModule } from './diaries/diaries.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { FriendsModule } from './friends/friends.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? typeORMProdConfig
        : process.env.NODE_ENV === 'test'
          ? typeORMTestConfig
          : typeORMDevConfig,
    ),
    RedisModule.forRoot({
      config: process.env.NODE_ENV === 'test' ? testRedisConfig : redisConfig,
    }),
    DiariesModule,
    TagsModule,
    FriendsModule,
    ReactionsModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
