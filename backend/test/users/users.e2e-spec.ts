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
import { FriendsRepository } from 'src/friends/friends.repository';
import { FriendStatus } from 'src/friends/entity/friendStatus';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;
  let usersRepository: UsersRepository;
  let friendsRepository: FriendsRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    usersRepository = module.get<UsersRepository>(UsersRepository);
    friendsRepository = module.get<FriendsRepository>(FriendsRepository);

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

  let user: User;
  let accessToken: string;

  const userInfo = {
    socialId: '1234',
    socialType: SocialType.NAVER,
    nickname: 'test',
    email: 'test@abc.com',
    profileImage: 'profile image',
  };

  beforeEach(async () => {
    await queryRunner.startTransaction();

    user = await usersRepository.save(userInfo);
    accessToken = await testLogin(user);
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  describe('/users (PATCH)', () => {
    const url = '/users';

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

  describe('/users/:userId (GET)', () => {
    const friendInfo = {
      socialId: '1',
      socialType: SocialType.NAVER,
      nickname: 'friend',
      email: 'friend@abc.com',
      profileImage: 'profile image',
    };

    it('친구가 아닌 사용자 정보 조회', async () => {
      // given
      const friend = await usersRepository.save(friendInfo);
      const url = `/users/${friend.id}`;

      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .set('Cookie', [`utk=${accessToken}`]);

      // then
      expect(response.statusCode).toEqual(200);
      expect(response.body.nickname).toEqual('friend');
      expect(response.body.relation).toBeNull();
    });

    it('친구인 사용자 정보 조회', async () => {
      // given
      const friend = await usersRepository.save(friendInfo);
      const url = `/users/${friend.id}`;
      const relation = await friendsRepository.save({ sender: user, receiver: friend });

      await friendsRepository.update(relation.id, { status: FriendStatus.COMPLETE });

      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .set('Cookie', [`utk=${accessToken}`]);

      // then
      expect(response.statusCode).toEqual(200);
      expect(response.body.nickname).toEqual('friend');
      expect(response.body.totalFriends).toEqual(1);
      expect(response.body.relation.status).toEqual(FriendStatus.COMPLETE);
    });

    it('존재하지 않는 사용자를 조회하는 경우 예외 발생', async () => {
      // given
      const url = '/users/999999';

      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .set('Cookie', [`utk=${accessToken}`]);

      // then
      expect(response.statusCode).toEqual(400);
    });
  });

  describe('/users/search/:nickname (GET)', () => {
    const url = '/users/search/friend';

    it('닉네임으로 사용자 검색', async () => {
      // given
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

      await usersRepository.save(friend1Info);
      await usersRepository.save(friend2Info);

      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .set('Cookie', [`utk=${accessToken}`]);

      // then
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].nickname).toEqual('friend1');
    });

    it('검색어를 포함하는 닉네임의 사용자가 없는 경우 빈 배열 반환', async () => {
      // given
      const friend1Info = {
        socialId: '1',
        socialType: SocialType.NAVER,
        nickname: '친구1',
        email: 'friend1@abc.com',
        profileImage: 'profile image',
      };
      const friend2Info = {
        socialId: '2',
        socialType: SocialType.NAVER,
        nickname: '친구2',
        email: 'friend2@abc.com',
        profileImage: 'profile image',
      };

      await usersRepository.save(friend1Info);
      await usersRepository.save(friend2Info);

      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .set('Cookie', [`utk=${accessToken}`]);

      // then
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(0);
    });
  });
});
