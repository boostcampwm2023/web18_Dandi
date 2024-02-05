import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource, QueryRunner } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { TagsService } from 'src/tags/tags.service';
import Redis from 'ioredis';
import { testRedisConfig } from 'src/configs/redis.config';

describe('TagsController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;
  let tagsService: TagsService;

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
    dataSource.createQueryRunner = jest.fn();
    queryRunner.release = jest.fn();
    (dataSource.createQueryRunner as jest.Mock).mockReturnValue(queryRunner);

    tagsService = module.get<TagsService>(TagsService);
    queryRunner = dataSource.createQueryRunner();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await redis.quit();
    await app.close();
  });

  describe('/search/:keyword (GET)', () => {
    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('일치하는 키워드가 없으면 빈 문자열 리스트 반환', async () => {
      //given
      const url = `/tags/search/${encodeURIComponent('안녕')}`;

      //when
      const response = await request(app.getHttpServer()).get(url).expect(200, { keywords: [] });
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body).toHaveLength(0);
    });

    it('일치하는 키워드가 있으면 모든 유사 문자열 리스트 반환', async () => {
      //given
      const url = `/tags/search/${encodeURIComponent('안녕')}`;
      const tagNames = ['안녕', '안녕하세요', '저리가세욧'];

      await tagsService.updateDataSetScore(mockUser.id, tagNames);

      //when
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.keywords.sort()).toEqual(['안녕', '안녕하세요'].sort());
    });
  });
});
