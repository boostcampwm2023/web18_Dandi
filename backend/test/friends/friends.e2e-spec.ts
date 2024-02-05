import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { DataSource, QueryRunner } from 'typeorm';
import { TestAuthGuard } from 'test/utils/testAuthGuard';
import { UsersRepository } from 'src/users/users.repository';
import { SocialType } from 'src/users/entity/socialType';

describe('FriendsController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TestAuthGuard],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => {
          return true;
        },
      })
      .compile();

    const dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
    dataSource.createQueryRunner = jest.fn();
    queryRunner.release = jest.fn();
    (dataSource.createQueryRunner as jest.Mock).mockReturnValue(queryRunner);

    usersRepository = module.get<UsersRepository>(UsersRepository);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('test', async () => {
    await queryRunner.startTransaction();
    const user = await usersRepository.createUser(
      {
        id: '1234',
        nickname: 'test',
        email: 'test@abc.com',
        profile_image: 'profile image',
      },
      SocialType.NAVER,
    );

    const res = await request(app.getHttpServer())
      .post('/')
      .use(() => new TestAuthGuard(user));

    expect(res.statusCode).toEqual(404);

    await queryRunner.rollbackTransaction();
  });
});
