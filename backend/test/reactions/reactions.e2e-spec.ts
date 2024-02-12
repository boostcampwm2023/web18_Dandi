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
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  describe('/reactions/:diaryId (GET)', () => {
    it('특정 일기의 리액션 조회', async () => {
      // given
      const url = `/reactions/${diary.id}`;
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
      // given
      const url = `/reactions/${diary.id}`;

      // when
      const response = await request(app.getHttpServer())
        .get(url)
        .set('Cookie', [`utk=${accessToken}`]);

      // then
      expect(response.statusCode).toEqual(200);
      expect(response.body.reactionList).toEqual([]);
    });
  });
});
