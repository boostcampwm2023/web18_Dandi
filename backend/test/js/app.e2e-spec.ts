import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource, QueryRunner } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
    const response = await request(app.getHttpServer()).get('/');

    expect(response.status).toEqual(404);
  });

  it('/diaries/:id (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/diaries/1');
    const body = response.body;

    expect(response.status).toEqual(401);
    expect(body.message).toEqual('Unauthorized');
  });
  it('/diaries/:id (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/diaries/1');
    const body = response.body;

    expect(response.status).toEqual(401);
    expect(body.message).toEqual('Unauthorized');
  });
});
