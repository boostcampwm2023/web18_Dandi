import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource, QueryRunner } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { JwtAuthStrategy } from 'src/auth/strategy/jwtAuth.strategy';

/*
  테스트 흐름
  1. 사용자 정보 생성 -> beforeAll
  2. 사용자 정보를 반환하도록 jwt 모킹 -> beforeAll
  3. 해당 사용자 정보를 사용해 테스트 이전 필요한 정보 DB 저장 -> given
  4. 
*/
describe('TagsController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;

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

          console.log(req);
          console.log(req.user);
          return true;
        },
      })
      .compile();

    const dataSource = module.get<DataSource>(DataSource);
    app = module.createNestApplication();
    queryRunner = dataSource.createQueryRunner();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/search/:keyword (GET)', () => {
    beforeEach(async () => await queryRunner.startTransaction());
    afterEach(async () => await queryRunner.rollbackTransaction());

    it('일치하는 키워드가 없으면 빈 문자열 리스트 반환', () => {
      //given
      const url = `/tags/search/${encodeURIComponent('안녕')}`;

      //when - then
      return request(app.getHttpServer()).get(url).expect(200, { keywords: [] });
    });
  });
});
