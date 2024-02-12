import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DataSource, QueryRunner } from 'typeorm';
import { Diary } from 'src/diaries/entity/diary.entity';
import { SocialType } from 'src/users/entity/socialType';
import { DiaryStatus } from 'src/diaries/entity/diaryStatus';
import { DiariesRepository } from 'src/diaries/diaries.repository';
import { ReactionsRepository } from 'src/reactions/reactions.repository';
import { UsersRepository } from 'src/users/users.repository';
import { MoodDegree } from 'src/diaries/utils/diaries.constant';
import * as cookieParser from 'cookie-parser';
import { User } from 'src/users/entity/user.entity';
import { testLogin } from 'test/utils/testLogin';

describe('FriendsController (e2e)', () => {
  let app: INestApplication;
  let queryRunner: QueryRunner;
  let reactionsRepository: ReactionsRepository;
  let diariesRepository: DiariesRepository;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    reactionsRepository = module.get<ReactionsRepository>(ReactionsRepository);
    diariesRepository = module.get<DiariesRepository>(DiariesRepository);
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

  let user: User;
  let accessToken: string;
  let diary: Diary;
  let url: string;

  const userInfo = {
    socialId: '1234',
    socialType: SocialType.NAVER,
    nickname: 'test',
    email: 'test@abc.com',
    profileImage: 'profile image',
  };
  const friendInfo = {
    socialId: '12345',
    socialType: SocialType.NAVER,
    nickname: 'friend',
    email: 'friend@abc.com',
    profileImage: 'profile image',
  };
  const diaryInfo = {
    title: '제목',
    content: '<p>내용</p>',
    thumbnail: null,
    emotion: '🥰',
    tagNames: ['일기', '안녕'],
    status: DiaryStatus.PUBLIC,
    summary: '일기 요약',
    mood: MoodDegree.SO_SO,
  };

  beforeEach(async () => {
    await queryRunner.startTransaction();

    user = await usersRepository.save(userInfo);
    accessToken = await testLogin(user);
    diaryInfo['author'] = user;
    diary = await diariesRepository.save(diaryInfo);
    url = `/reactions/${diary.id}`;
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  describe('/reactions/:diaryId (GET)', () => {
    it('특정 일기의 리액션 조회', async () => {
      // given
      const friend = await usersRepository.save(friendInfo);

      await reactionsRepository.save({ user, diary, reaction: '🔥' });
      await reactionsRepository.save({ user: friend, diary, reaction: '🥰' });

      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .set('Cookie', [`utk=${accessToken}`]);

      // then
      expect(response.statusCode).toEqual(200);
      expect(response.body.reactionList).toHaveLength(2);
      expect(response.body.reactionList[0].reaction).toEqual('🔥');
    });

    it('일기의 리액션 없는 경우 빈 배열 반환', async () => {
      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .set('Cookie', [`utk=${accessToken}`]);

      // then
      expect(response.statusCode).toEqual(200);
      expect(response.body.reactionList).toEqual([]);
    });
  });

  describe('/reactions/:diaryId (POST)', () => {
    beforeEach(() => {
      jest.spyOn(reactionsRepository, 'save');
    });

    it('리액션 저장', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post(url)
        .set('Cookie', [`utk=${accessToken}`])
        .send({ reaction: '🥰' });

      // then
      expect(response.statusCode).toEqual(201);
      expect(reactionsRepository.save).toHaveBeenCalled();
    });

    it('해당 일기에 이미 리액션을 남긴 경우 예외 발생', async () => {
      // given
      await reactionsRepository.save({ user, diary, reaction: '🔥' });
      jest.clearAllMocks();

      // when
      const response = await request(app.getHttpServer())
        .post(url)
        .set('Cookie', [`utk=${accessToken}`])
        .send({ reaction: '🥰' });

      // then
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual('이미 해당 글에 리액션을 남겼습니다.');
      expect(reactionsRepository.save).toHaveBeenCalledTimes(0);
    });
  });

  describe('/reactions/:diaryId (PUT)', () => {
    beforeEach(() => {
      jest.spyOn(reactionsRepository, 'save');
    });

    it('리액션 수정', async () => {
      // given
      await reactionsRepository.save({ user, diary, reaction: '🔥' });

      // when
      const response = await request(app.getHttpServer())
        .put(url)
        .set('Cookie', [`utk=${accessToken}`])
        .send({ reaction: '🥰' });

      // then
      expect(response.statusCode).toEqual(200);
      expect(reactionsRepository.save).toHaveBeenCalledTimes(2);
    });

    it('리액션이 존재하지 않는데 해당 요청을 보낸 경우 예외 발생', async () => {
      // given
      jest.clearAllMocks();

      // when
      const response = await request(app.getHttpServer())
        .put(url)
        .set('Cookie', [`utk=${accessToken}`])
        .send({ reaction: '🥰' });

      // then
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual('리액션 기록이 존재하지 않습니다.');
      expect(reactionsRepository.save).toHaveBeenCalledTimes(0);
    });
  });
});
