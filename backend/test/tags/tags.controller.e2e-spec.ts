import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource, QueryRunner } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { JwtAuthStrategy } from 'src/auth/strategy/jwtAuth.strategy';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;

  const mockUser = {
    id: 1,
    nickname: test,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: JwtAuthGuard,
          useValue: {
            canActive: jest.fn(),
          },
        },
        {
          provide: JwtAuthStrategy,
          useValue: {
            validate: jest.fn().mockImplementation((payload, done) => {
              return done(null, mockUser);
            }),
          },
        },
      ],
    }).compile();
    const dataSource = module.get<DataSource>(DataSource);

    app = module.createNestApplication();
    queryRunner = dataSource.createQueryRunner();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => await queryRunner.startTransaction());
  afterEach(async () => await queryRunner.rollbackTransaction());

  it('/ (GET)', async () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });
});
