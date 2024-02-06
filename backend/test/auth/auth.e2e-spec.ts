import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { testRedisConfig } from 'src/configs/redis.config';
import Redis from 'ioredis';
import { DataSource, QueryRunner } from 'typeorm';
import { UsersRepository } from 'src/users/users.repository';
import { SocialType } from 'src/users/entity/socialType';
import { User } from 'src/users/entity/user.entity';

/**
 * naver 쪽에서 처리하는 의존성을 제거했습니다.
 * 1. query로 넘어오는 code, state, socialType 또한 naver에서 반환해주는 값이기 때문에 정상적이라고 가정
 * 2. AuthService의 getProfile, getToken 또한 naver에 query로 넘어온 정보로 요청을 보내기 때문에 정상적이라고 가정
 */
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let usersRepository: UsersRepository;
  let queryRunner: QueryRunner;
  const redis = new Redis(testRedisConfig);

  const mockProfile = {
    id: '1',
    email: 'test@test.com',
    nickname: 'testUser',
    profile_image: 'testImage',
  };
  const mockAccessToken = 'mock token';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
    dataSource.createQueryRunner = jest.fn();
    queryRunner.release = jest.fn();
    (dataSource.createQueryRunner as jest.Mock).mockReturnValue(queryRunner);

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await redis.quit();
    await app.close();
  });

  beforeEach(async () => {
    await redis.flushall();
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  describe('/login (POST)', () => {
    beforeAll(() => {
      jest.spyOn(authService, <keyof AuthService>'getToken').mockResolvedValue(mockAccessToken);
      jest
        .spyOn(authService, <keyof AuthService>'getUserProfile')
        .mockResolvedValue(mockProfile as any);
      jest.spyOn(usersRepository, 'createUser');
    });

    afterEach(() => {
      (usersRepository.createUser as jest.Mock).mockClear();
    });

    it('DB에 존재하지 않는 socialId로 로그인 요청이 오면, 회원가입 후 토큰 반환', async () => {
      //given
      const url = '/auth/login';
      const body = { code: 'code', state: 'state', socialType: 'naver' };

      //when
      const response = await request(app.getHttpServer()).post(url).send(body);

      //then
      expect(response.status).toEqual(201);
      expect(response.header['set-cookie']).toBeTruthy();
      expect(usersRepository.createUser).toHaveBeenCalled();
    });

    it('DB에 존재하는 않는 socialId로 로그인 요청이 오면, 회원가입 후 토큰 반환', async () => {
      //given
      const user = {
        id: 1,
        email: mockProfile.email,
        nickname: mockProfile.nickname,
        socialId: mockProfile.id,
        socialType: SocialType.NAVER,
        profileImage: mockProfile.profile_image,
      } as User;
      const url = '/auth/login';
      const body = { code: 'code', state: 'state', socialType: 'naver' };

      await usersRepository.save(user);

      //when
      const response = await request(app.getHttpServer()).post(url).send(body);

      //then
      console.log(response);
      expect(response.status).toEqual(201);
      expect(response.header['set-cookie']).toBeTruthy();
      expect(usersRepository.createUser).not.toHaveBeenCalled();
    });
  });
});
