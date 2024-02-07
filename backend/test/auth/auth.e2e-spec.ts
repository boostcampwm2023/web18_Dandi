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
import * as cookieParser from 'cookie-parser';

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
  const body = { code: 'code', state: 'state', socialType: 'naver' };

  beforeAll(async () => {
    await redis.flushall();
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
    app.use(cookieParser());
    await app.init();

    jest.spyOn(authService, <keyof AuthService>'getToken').mockResolvedValue(mockAccessToken);
    jest
      .spyOn(authService, <keyof AuthService>'getUserProfile')
      .mockResolvedValue(mockProfile as any);
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
    await redis.flushall();
    await queryRunner.rollbackTransaction();
  });

  describe('/login (POST)', () => {
    beforeAll(() => {
      jest.spyOn(usersRepository, 'createUser');
    });

    afterEach(() => {
      (usersRepository.createUser as jest.Mock).mockClear();
    });

    it('DB에 존재하지 않는 socialId로 로그인 요청이 오면, 회원가입 후 토큰 반환', async () => {
      //given
      const url = '/auth/login';

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

      await usersRepository.save(user);

      //when
      const response = await request(app.getHttpServer()).post(url).send(body);

      //then
      expect(response.status).toEqual(201);
      expect(response.header['set-cookie']).toBeTruthy();
      expect(usersRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('/refresh_token (GET)', () => {
    it('유효한 jwt 토큰으로 refresh 요청 시 새 토큰 발급', async () => {
      //given
      const url = '/auth/refresh_token';
      const agent = request.agent(app.getHttpServer());
      await agent.post('/auth/login').send(body);

      //when
      const response = await agent.get(url);

      //then
      expect(response.status).toEqual(200);
      expect(response.header['set-cookie']).toBeTruthy();
    });

    it('jwt 없이 refresh 요청 시 401 에러 발생', async () => {
      //given
      const url = '/auth/refresh_token';
      const agent = request.agent(app.getHttpServer());
      await agent.post('/auth/login').send(body);

      //when
      const response = await request(app.getHttpServer()).get(url);

      //then
      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('redis에 저장되지 않은 토큰으로 요청 시 401 에러 발생', async () => {
      //given
      const url = '/auth/refresh_token';
      const agent = request.agent(app.getHttpServer());

      await agent.post('/auth/login').send(body);
      redis.flushall();

      //when
      const response = await agent.get(url);

      //then
      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual('로그인이 필요합니다.');
    });
  });

  describe('/logout (POST)', () => {
    /**
     * 로그인 후 토큰 만료 시키고, 리프레쉬 되는지 확인
     */
    it('유효한 jwt 토큰으로 logout 요청 시 201 반환', async () => {
      //given
      const url = '/auth/logout';
      const agent = request.agent(app.getHttpServer());

      await agent.post('/auth/login').send(body);

      //when
      const response = await agent.post(url);

      //then
      expect(response.status).toEqual(201);
      expect(response.header['set-cookie']).toHaveLength(1);
      expect(response.header['set-cookie'][0]).toContain('Max-Age=0;');
    });

    it('비로그인 사용자가 로그아웃 요청을 보내면 201 반환', async () => {
      //given
      const url = '/auth/logout';

      //when
      const response = await request(app.getHttpServer()).post(url);

      //then
      expect(response.status).toEqual(201);
      expect(response.header['set-cookie']).toHaveLength(1);
      expect(response.header['set-cookie'][0]).toContain('Max-Age=0;');
    });
  });
});
