import * as request from 'supertest';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DataSource, QueryRunner } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

describe('FriendsController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;

  const mockUser = { id: 1 };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
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

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });
});
