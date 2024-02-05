import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { DataSource, QueryRunner } from 'typeorm';
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
import { TimeUnit } from 'src/diaries/dto/timeUnit.enum';
import { subMonths } from 'date-fns';

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
      await usersRepository.save(mockUser);

      //when
      const response = await request(app.getHttpServer()).post('/diaries').send(mockDiary);

      //then
      expect(response.status).toEqual(201);
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
      //given
      const diaryId = 1;

      //when
      const response = await request(app.getHttpServer()).get(`/diaries/${diaryId}`);

      //then
      expect(response.status).toEqual(400);
    });
  });

  describe('/diaries/:id (PATCH)', () => {
    const mockDiary = {
      title: '일기 제목',
      content: '일기 내용',
      emotion: '🐶',
      status: DiaryStatus.PRIVATE,
      summary: '요약',
      mood: MoodDegree.BAD,
      author: mockUser,
    } as Diary;

    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();

      await usersRepository.save(mockUser);
      await diariesRepository.save(mockDiary);
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('존재하지 않는 일기에 수정 요청을 하면 400 반환', async () => {
      //given
      const updateData = {};

      //when
      const response = await request(app.getHttpServer())
        .patch(`/diaries/${mockDiary.id + 1}`)
        .send(updateData);

      //then
      expect(response.status).toEqual(400);
    });

    it('수정 정보가 존재하지 않아도 200 반환', async () => {
      //given
      const updateData = {};

      //when
      const response = await request(app.getHttpServer())
        .patch(`/diaries/${mockDiary.id}`)
        .send(updateData);

      //then
      expect(response.status).toEqual(200);
    });

    it('수정 정보가 존재하면 해당 정보만 수정 후 200 반환', async () => {
      //given
      const updateData = {
        title: 'update title',
      };

      //when
      const response = await request(app.getHttpServer())
        .patch(`/diaries/${mockDiary.id}`)
        .send(updateData);

      //then
      expect(response.status).toEqual(200);
    });
  });

  describe('/diaries/:id (DELETE)', () => {
    const mockDiary = {
      title: '일기 제목',
      content: '일기 내용',
      emotion: '🐶',
      status: DiaryStatus.PRIVATE,
      summary: '요약',
      mood: MoodDegree.BAD,
      author: mockUser,
    } as Diary;

    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();

      await usersRepository.save(mockUser);
      await diariesRepository.save(mockDiary);
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('존재하지 않는 일기에 삭제 요청을 보내면 400 반환', async () => {
      //given
      const diaryId = mockDiary.id + 1;

      //when
      const response = await request(app.getHttpServer()).delete(`/diaries/${diaryId}`);

      //then
      expect(response.status).toEqual(400);
    });

    it('존재하는 일기에 삭제 요청을 보내면 200 반환', async () => {
      //given
      const diaryId = mockDiary.id;

      //when
      const response = await request(app.getHttpServer()).delete(`/diaries/${diaryId}`);

      //then
      expect(response.status).toEqual(200);
    });
  });

  describe('/diaries/users/:id (GET)', () => {
    const mockDiary = {
      title: '일기 제목',
      content: '일기 내용',
      emotion: '🐶',
      status: DiaryStatus.PRIVATE,
      summary: '요약',
      mood: MoodDegree.BAD,
      author: mockUser,
    } as Diary;

    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();

      await usersRepository.save(mockUser);
      await diariesRepository.save(mockDiary);
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    //TODO
    it('유효하지 않은 일자 타입으로 요청이 오면 400에러 발생', async () => {
      //given
      const dto = {
        type: 'wrongType',
      };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/users/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);

      //then
      expect(response.status).toEqual(400);
    });

    it('일자 타입이 Day가 아니고, 유효하지 않은 일자 형식으로 요청이 오면 400에러 발생', async () => {
      //given
      const dto = {
        type: TimeUnit.Month,
        startDate: '24-01-01',
        endDate: '24-01-01',
      };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/users/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);

      //then
      expect(response.status).toEqual(400);
    });

    it('일자 타입이 Day가 아니면, 기간 내 일기 조회 정보 반환', async () => {
      const now = new Date();
      const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate(),
      ).padStart(2, '0')}`;
      const dto = {
        type: TimeUnit.Month,
        startDate: '2024-01-01',
        endDate,
      };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/users/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.nickname).toEqual(mockUser.nickname);
      expect(body.diaryList).toHaveLength(1);
      expect(body.diaryList[0].diaryId).toEqual(mockDiary.id);
    });

    it('일자 타입이 Day가 아니고, 기간 내 일기가 없으면 빈 리스트 반환', async () => {
      const dto = {
        type: TimeUnit.Month,
        startDate: '2024-01-01',
        endDate: '2024-02-01',
      };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/users/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.nickname).toEqual(mockUser.nickname);
      expect(body.diaryList).toHaveLength(0);
    });

    it('일자 타입이 Day, lastIndex와 함께 요청이 오면 lastIndex보다 낮은 ID의 일기 조회 정보 반환', async () => {
      //given
      const dto = {
        type: TimeUnit.Day,
        lastIndex: String(mockDiary.id + 1),
      };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/users/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.nickname).toEqual(mockUser.nickname);
      expect(body.diaryList).toHaveLength(1);
      expect(body.diaryList[0].diaryId).toEqual(mockDiary.id);
    });

    it('일자 타입이 Day, lastIndex보다 낮은 ID의 일기가 존재하지 않으면 빈 배열 반환', async () => {
      //given
      const dto = {
        type: TimeUnit.Day,
        lastIndex: String(mockDiary.id - 1),
      };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/users/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.nickname).toEqual(mockUser.nickname);
      expect(body.diaryList).toHaveLength(0);
    });

    it('일자 타입이 Day, lastIndex 없이 요청이 오면 가장 최신의 일기 조회 정보 반환', async () => {
      //given
      const dto = {
        type: TimeUnit.Day,
      };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/users/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.nickname).toEqual(mockUser.nickname);
      expect(body.diaryList).toHaveLength(1);
      expect(body.diaryList[0].diaryId).toEqual(mockDiary.id);
    });
  });

  describe('/diaries/emotions/:userId (GET)', () => {
    const mockDiaryA = {
      title: '일기 제목',
      content: '일기 내용',
      emotion: '🐶',
      status: DiaryStatus.PRIVATE,
      summary: '요약',
      mood: MoodDegree.BAD,
      author: mockUser,
    } as Diary;
    const mockDiaryB = {
      title: '일기 제목',
      content: '일기 내용',
      emotion: '🌱',
      status: DiaryStatus.PRIVATE,
      summary: '요약',
      mood: MoodDegree.BAD,
      author: mockUser,
      createdAt: subMonths(new Date(), 2),
    } as Diary;

    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();

      await usersRepository.save(mockUser);
      await diariesRepository.save(mockDiaryA);
      await diariesRepository.save(mockDiaryB);
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('유효하지 않은 일자 타입으로 요청이 오면 400에러 발생', async () => {
      //given
      const dto = {
        startDate: '24-02-01',
      };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/emotions/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);

      //then
      expect(response.status).toEqual(400);
    });

    it('일자 정보가 없다면, 현재 일자로부터 한달 이내의 일기 감정 정보 반환', async () => {
      //given
      const url = `/diaries/emotions/${mockUser.id}`;

      //when
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.emotions).toHaveLength(1);
      expect(body.emotions[0].emotion).toEqual(mockDiaryA.emotion);
    });

    it('시작/종료 일자 중 하나라도 없다면, 현재 일자로부터 한달 이내의 일기 감정 정보 반환', async () => {
      //given
      const dto = {
        startDate: '2024-01-01',
      };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/emotions/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.emotions).toHaveLength(1);
      expect(body.emotions[0].emotion).toEqual(mockDiaryA.emotion);
    });

    it('시작/종료 일자 모두 존재하면, 해당 일자 사이의 일기 감정 정보 반환', async () => {
      //given
      const now = new Date();
      const startDate = `${mockDiaryB.createdAt.getFullYear()}-${String(
        mockDiaryB.createdAt.getMonth(),
      ).padStart(2, '0')}-${String(mockDiaryB.createdAt.getDate()).padStart(2, '0')}`;
      const lastDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(now.getDate()).padStart(2, '0')}`;

      const dto = { startDate, lastDate };
      const query = new URLSearchParams(dto).toString();
      const url = `/diaries/emotions/${mockUser.id}?${query}`;

      //when
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(response.status).toEqual(200);
      expect(body.emotions).toHaveLength(2);
      expect([mockDiaryA.emotion, mockDiaryB.emotion]).toContain(body.emotions[0].emotion);
      expect([mockDiaryA.emotion, mockDiaryB.emotion]).toContain(body.emotions[1].emotion);
    });
  });

  describe('/diaries/mood/:userId (GET)', () => {
    const mockDiary = {
      title: '일기 제목',
      content: '일기 내용',
      emotion: '🐶',
      status: DiaryStatus.PRIVATE,
      summary: '요약',
      mood: MoodDegree.BAD,
      author: mockUser,
    } as Diary;

    beforeEach(async () => {
      await redis.flushall();
      await queryRunner.startTransaction();

      await usersRepository.save(mockUser);
      await diariesRepository.save(mockDiary);
    });

    afterEach(async () => {
      await queryRunner.rollbackTransaction();
    });

    it('1년내 일기 정보가 존재하면 해당 감정 통계 반환', async () => {
      //given
      const url = `/diaries/emotions/${mockUser.id}`;

      //when - then
      const response = await request(app.getHttpServer()).get(url);
      const body = response.body;

      //then
      expect(body.emotions).toHaveLength(1);
      expect(body.emotions[0].emotion).toEqual(mockDiary.emotion);
    });
  });
});
