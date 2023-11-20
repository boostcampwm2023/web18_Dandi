import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redisConfig } from './configs/redis.config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { DiariesModule } from './diaries/diaries.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(typeORMConfig),
    RedisModule.forRoot({ config: redisConfig }),
    DiariesModule,
    TagsModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
