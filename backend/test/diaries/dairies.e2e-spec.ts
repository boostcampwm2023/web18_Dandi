import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource, QueryRunner } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import Redis from 'ioredis';
import { testRedisConfig } from 'src/configs/redis.config';

describe('TagsController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;

  const redis = new Redis(testRedisConfig);
  const mockUser = {
    id: 1,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockUser;

          return true;
        },
      })
      .compile();

    const dataSource = module.get<DataSource>(DataSource);

    queryRunner = dataSource.createQueryRunner();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await redis.quit();
    await app.close();
  });

  describe('/diaries (POST)', () => {
    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('일기 저장 완료 후 완료 메시지 반환', async () => {
      //given
      const tagNames = ['안녕', '안녕하세요', '저리가세욧'];
      const mockDiary = {
        title: '일기 제목',
        content: '일기 내용',
        emotion: '🐶',
        tagNames,
        status: 'private',
      };

      //when - then
      return request(app.getHttpServer()).post('/diaries').send(mockDiary).expect(201);
    });
  });
});
