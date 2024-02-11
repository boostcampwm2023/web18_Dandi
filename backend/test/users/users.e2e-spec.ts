import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DataSource, QueryRunner } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import { UsersRepository } from 'src/users/users.repository';
import { User } from 'src/users/entity/user.entity';
import { SocialType } from 'src/users/entity/socialType';
import { testLogin } from 'test/utils/testLogin';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    usersRepository = module.get<UsersRepository>(UsersRepository);

    const dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
    dataSource.createQueryRunner = jest.fn();
    queryRunner.release = jest.fn();
    (dataSource.createQueryRunner as jest.Mock).mockReturnValue(queryRunner);

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  describe('/users (PATCH)', () => {
    const url = '/users';
    let user: User;
    let accessToken: string;

    beforeEach(async () => {
      const userInfo = {
        socialId: '1234',
        socialType: SocialType.NAVER,
        nickname: 'test',
        email: 'test@abc.com',
        profileImage: 'profile image',
      };

      user = await usersRepository.save(userInfo);
      accessToken = await testLogin(user);
    });

    it('프로필 사진과 사용자 닉네임 수정', async () => {
      // given
      const imageFilePath = './test/testImage.png';

      // when
      const response = await request(app.getHttpServer())
        .patch(url)
        .set('Cookie', [`utk=${accessToken}`])
        .field('nickname', '테스트')
        .attach('profileImage', imageFilePath);

      // then
      expect(response.statusCode).toEqual(200);
    });

    it('프로필 사진만 수정', async () => {
      // given
      const imageFilePath = './test/testImage.png';

      // when
      const response = await request(app.getHttpServer())
        .patch(url)
        .set('Cookie', [`utk=${accessToken}`])
        .attach('profileImage', imageFilePath);

      // then
      expect(response.statusCode).toEqual(200);
    });

    it('사용자 닉네임만 수정', async () => {
      // when
      const response = await request(app.getHttpServer())
        .patch(url)
        .set('Cookie', [`utk=${accessToken}`])
        .field('nickname', '테스트');

      // then
      expect(response.statusCode).toEqual(200);
    });

    it('수정할 프로필 사진의 파일 형식이 옳바르지 않은 경우 예외 발생', async () => {
      // given
      const filePath = './test/users/testFile.txt';

      // when
      const response = await request(app.getHttpServer())
        .patch(url)
        .set('Cookie', [`utk=${accessToken}`])
        .attach('profileImage', filePath);

      // then
      expect(response.statusCode).toEqual(400);
    });

    it('수정할 정보가 없는 경우 예외 발생', async () => {
      // when
      const response = await request(app.getHttpServer())
        .patch(url)
        .set('Cookie', [`utk=${accessToken}`]);

      // then
      expect(response.statusCode).toEqual(400);
    });
  });
});
