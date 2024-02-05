import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { DataSource, QueryRunner } from 'typeorm';
import { TestAuthGuard } from 'test/utils/testAuthGuard';
import { UsersRepository } from 'src/users/users.repository';
import { SocialType } from 'src/users/entity/socialType';
import { FriendsRepository } from 'src/friends/friends.repository';
import { FriendStatus } from 'src/friends/entity/friendStatus';

describe('FriendsController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;
  let friendsRepository: FriendsRepository;
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

    friendsRepository = module.get<FriendsRepository>(FriendsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const userInfo = {
    socialId: '1234',
    socialType: SocialType.NAVER,
    nickname: 'test',
    email: 'test@abc.com',
    profileImage: 'profile image',
  };
  const friend1Info = {
    socialId: '1',
    socialType: SocialType.NAVER,
    nickname: 'friend1',
    email: 'friend1@abc.com',
    profileImage: 'profile image',
  };
  const friend2Info = {
    socialId: '2',
    socialType: SocialType.NAVER,
    nickname: 'friend2',
    email: 'friend2@abc.com',
    profileImage: 'profile image',
  };

  describe('/friends/:userId (GET)', () => {
    beforeEach(async () => {
      await queryRunner.startTransaction();
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('친구목록 조회, 친구가 없는 경우 빈 배열 반환', async () => {
      // given
      const user = await usersRepository.save(userInfo);
      const url = `/friends/${user.id}`;

      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .use(() => new TestAuthGuard(user));

      // then
      expect(response.statusCode).toEqual(200);
      expect(response.body.friends).toEqual([]);
    });

    it('친구 목록 정상 조회', async () => {
      // given
      const user = await usersRepository.save(userInfo);
      const url = `/friends/${user.id}`;

      const friend1 = await usersRepository.save(friend1Info);
      const friend2 = await usersRepository.save(friend2Info);
      const relation1 = await friendsRepository.save({ sender: user, receiver: friend1 });
      const relation2 = await friendsRepository.save({ sender: friend2, receiver: user });
      await friendsRepository.update(relation1.id, { status: FriendStatus.COMPLETE });
      await friendsRepository.update(relation2.id, { status: FriendStatus.COMPLETE });

      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .use(() => new TestAuthGuard(user));

      // then
      expect(response.statusCode).toEqual(200);
      expect(response.body.friends).toHaveLength(2);
    });
  });
});
