import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import Redis from 'ioredis';
import { testRedisConfig } from 'src/configs/redis.config';
import { DiariesRepository } from 'src/diaries/diaries.repository';
import { Diary } from 'src/diaries/entity/diary.entity';
import { DiaryStatus } from 'src/diaries/entity/diaryStatus';
import { MoodDegree } from 'src/diaries/utils/diaries.constant';
import { User } from 'src/users/entity/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { SocialType } from 'src/users/entity/socialType';
import { Friend } from 'src/friends/entity/friend.entity';
import { FriendsRepository } from 'src/friends/friends.repository';
import { FriendStatus } from 'src/friends/entity/friendStatus';

describe('Dairies Controller (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;
  let diariesRepository: DiariesRepository;
  let usersRepository: UsersRepository;
  let friendsRepository: FriendsRepository;

  const redis = new Redis(testRedisConfig);
  const mockUser = {
    id: 1,
    email: 'test@test.com',
    nickname: 'test',
    socialId: 'test123',
    socialType: SocialType.NAVER,
    profileImage: 'testImage',
  } as User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    diariesRepository = module.get<DiariesRepository>(DiariesRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    friendsRepository = module.get<FriendsRepository>(FriendsRepository);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await redis.quit();
    await app.close();
  });

  describe('/diaries (POST)', () => {
    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('일기 저장 완료 후 완료 메시지 반환', async () => {
      //given
      const tagNames = ['안녕', '안녕하세요', '저리가세욧'];
      const mockDiary = {
        title: '일기 제목',
        content: '일기 내용',
        emotion: '🐶',
        tagNames,
        status: 'private',
      };
      const savedUser = await usersRepository.save(mockUser);

      //when - then
      return request(app.getHttpServer()).post('/diaries').send(mockDiary).expect(201);
    });
  });

  describe('/diaries/friends (GET)', () => {
    const mockFriend = {
      email: 'test2@test.com',
      nickname: 'test2',
      socialId: 'test2',
      socialType: SocialType.NAVER,
      profileImage: 'testImage',
    } as User;
    const mockFriendRelation = {
      sender: mockFriend,
      receiver: mockUser,
      status: FriendStatus.COMPLETE,
    } as Friend;

    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();

      await usersRepository.save(mockUser);
      await usersRepository.save(mockFriend);
      await friendsRepository.save(mockFriendRelation);
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('일기 존재 시 일기 상세 정보 반환', async () => {
      //given
      const mockDiary = {
        title: '일기 제목',
        content: '일기 내용',
        emotion: '🐶',
        status: DiaryStatus.PUBLIC,
        summary: '요약',
        mood: MoodDegree.BAD,
        author: mockFriend,
      } as Diary;

      const savedDiary = await diariesRepository.save(mockDiary);

      //when
      const response = await request(app.getHttpServer()).get(`/diaries/friends`);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.diaryList).toHaveLength(1);
      expect(body.diaryList[0].diaryId).toEqual(savedDiary.id);
    });

    it('private으로 설정된 친구 일기 조회 불가', async () => {
      //given
      const mockDiary = {
        title: '일기 제목',
        content: '일기 내용',
        emotion: '🐶',
        status: DiaryStatus.PRIVATE,
        summary: '요약',
        mood: MoodDegree.BAD,
        author: mockFriend,
      } as Diary;

      await diariesRepository.save(mockDiary);

      //when
      const response = await request(app.getHttpServer()).get(`/diaries/friends`);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.diaryList).toHaveLength(0);
    });

    it('lastIndex를 설정하면 해당 index보다 id가 작은 일기 정보 반환', async () => {
      //given
      let lastIndex = 0;
      for (let i = 0; i < 5; i++) {
        const mockDiary = {
          title: '일기 제목',
          content: '일기 내용',
          emotion: '🐶',
          status: DiaryStatus.PUBLIC,
          summary: '요약',
          mood: MoodDegree.BAD,
          author: mockFriend,
        } as Diary;

        await diariesRepository.save(mockDiary);
        if (i == 2) {
          lastIndex = mockDiary.id;
        }
      }

      //when
      const response = await request(app.getHttpServer()).get(
        `/diaries/friends?lastIndex=${lastIndex}`,
      );
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.diaryList).toHaveLength(2);
    });
  });

  describe('/diaries/:id (GET)', () => {
    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('일기 존재 시 일기 상세 정보 반환', async () => {
      //given
      const mockDiary = {
        title: '일기 제목',
        content: '일기 내용',
        emotion: '🐶',
        status: DiaryStatus.PRIVATE,
        summary: '요약',
        mood: MoodDegree.BAD,
        author: mockUser,
      } as Diary;

      const savedUser = await usersRepository.save(mockUser);
      const savedDiary = await diariesRepository.save(mockDiary);

      //when
      const response = await request(app.getHttpServer()).get(`/diaries/${savedDiary.id}`);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.emotion).toEqual('🐶');
    });

    it('일기 정보가 존재하지 않으면 400 에러 발생', async () => {
      //when - then
      return request(app.getHttpServer()).get(`/diaries/1`).expect(400);
    });
  });
});
