import { UsersService } from 'src/users/users.service';
import { DiariesRepository } from './diaries.repository';
import { DiariesService } from './diaries.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from 'src/tags/tags.service';
import { FriendsService } from 'src/friends/friends.service';
import { User } from 'src/users/entity/user.entity';
import { DiaryStatus } from './entity/diaryStatus';
import { MoodDegree } from './utils/diaries.constant';
import { getSummary, judgeOverallMood } from './utils/clovaRequest';
import {
  AllDiaryInfosDto,
  FeedDiaryDto,
  GetAllEmotionsResponseDto,
  GetDiaryResponseDto,
  SearchDiaryDataForm,
  UpdateDiaryDto,
} from './dto/diary.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Diary } from './entity/diary.entity';
import { TimeUnit } from './dto/timeUnit.enum';

jest.mock('src/users/users.service');
jest.mock('./diaries.repository');
jest.mock('src/tags/tags.service');
jest.mock('src/friends/friends.service');
jest.mock('./utils/clovaRequest');

describe('DiariesService', () => {
  let diariesService: DiariesService;
  let diariesRepository: DiariesRepository;
  let usersService: UsersService;
  let tagsService: TagsService;
  let friendsService: FriendsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiariesService, DiariesRepository, UsersService, TagsService, FriendsService],
    }).compile();

    diariesService = module.get<DiariesService>(DiariesService);
    diariesRepository = module.get<DiariesRepository>(DiariesRepository);
    usersService = module.get<UsersService>(UsersService);
    tagsService = module.get<TagsService>(TagsService);
    friendsService = module.get<FriendsService>(FriendsService);
  });

  describe('saveDiary', () => {
    beforeEach(() => jest.clearAllMocks());

    it('일기 저장', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const createDiaryDto = {
        title: '제목',
        content: '<p>일기 내용</p>',
        thumbnail: '',
        emotion: '🔥',
        tagNames: ['tag1', 'tag2'],
        status: DiaryStatus.PUBLIC,
      };
      const diary = {
        title: '제목',
        content: '<p>일기 내용</p>',
        thumbnail: '',
        emotion: '🔥',
        status: DiaryStatus.PUBLIC,
      };
      const tags = [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ];

      (tagsService.mapTagNameToTagType as jest.Mock).mockResolvedValue(tags);
      (diariesRepository.save as jest.Mock).mockResolvedValue(diary);
      (getSummary as jest.Mock).mockResolvedValue('일기 요약');
      (judgeOverallMood as jest.Mock).mockResolvedValue(MoodDegree.SO_SO);

      // when
      await diariesService.saveDiary(user, createDiaryDto);

      // then
      expect(tagsService.mapTagNameToTagType).toHaveBeenCalledTimes(1);
      expect(tagsService.updateDataSetScore).toHaveBeenCalledTimes(1);
      expect(getSummary).toHaveBeenCalledTimes(1);
      expect(judgeOverallMood).toHaveBeenCalledTimes(1);
      expect(diariesRepository.save).toHaveBeenCalledTimes(1);
      expect(diariesRepository.addDiaryEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('findDiaryDetail', () => {
    beforeEach(() => jest.clearAllMocks());

    it('작성자, 태그, 리액션 포함한 일기 상세 조회', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const diaryId = 1;
      const diary = {
        userId: 1,
        authorName: 'test1',
        profileImage: null,
        title: '제목',
        content: '<p>일기 내용</p>',
        thumbnail: '',
        emotion: '🔥',
        mood: MoodDegree.SO_SO,
        status: DiaryStatus.PUBLIC,
        tags: ['tag1', 'tag2'],
        reactionCount: 3,
        createdAt: new Date('2024-01-16T16:11:31.757Z'),
      } as GetDiaryResponseDto;

      (diariesRepository.findDiaryDetailById as jest.Mock).mockResolvedValue(diary);

      // when
      const result = await diariesService.findDiaryDetail(user, diaryId);

      // then
      expect(result).toEqual(diary);
    });

    it('해당 id의 일기가 존재하지 않는 경우 예외 발생', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const diaryId = 1;

      (diariesRepository.findDiaryDetailById as jest.Mock).mockResolvedValue(null);

      // when - then
      await expect(async () => await diariesService.findDiaryDetail(user, diaryId)).rejects.toThrow(
        new BadRequestException('존재하지 않는 일기입니다.'),
      );
    });

    it('private 일기를 다른 사용자가 조회하려 할 때 예외 발생', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const diaryId = 1;
      const diary = {
        userId: 2,
        authorName: 'test1',
        profileImage: null,
        title: '제목',
        content: '<p>일기 내용</p>',
        thumbnail: '',
        emotion: '🔥',
        mood: MoodDegree.SO_SO,
        status: DiaryStatus.PRIVATE,
        tags: ['tag1', 'tag2'],
        reactionCount: 3,
        createdAt: new Date('2024-01-16T16:11:31.757Z'),
      } as GetDiaryResponseDto;

      (diariesRepository.findDiaryDetailById as jest.Mock).mockResolvedValue(diary);

      // when - then
      await expect(async () => await diariesService.findDiaryDetail(user, diaryId)).rejects.toThrow(
        new ForbiddenException('권한이 없는 사용자입니다.'),
      );
    });
  });

  describe('findDiary', () => {
    beforeEach(() => jest.clearAllMocks());

    it('일기 조회', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const diaryId = 1;
      const diary = {
        title: '제목',
        content: '<p>일기 내용</p>',
        thumbnail: '',
        emotion: '🔥',
        status: DiaryStatus.PUBLIC,
        author: user,
      };

      (diariesRepository.findById as jest.Mock).mockResolvedValue(diary);

      // when
      const result = await diariesService.findDiary(user, diaryId);

      // then
      expect(result).toEqual(diary);
    });

    it('해당 id의 일기가 존재하지 않는 경우 예외 발생', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const diaryId = 1;

      (diariesRepository.findById as jest.Mock).mockResolvedValue(null);

      // when - then
      await expect(async () => await diariesService.findDiary(user, diaryId)).rejects.toThrow(
        new BadRequestException('존재하지 않는 일기입니다.'),
      );
    });

    it('private 일기를 다른 사용자가 조회하려 할 때 예외 발생', async () => {
      // given
      const user1 = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const user2 = { id: 2, email: 'test2', nickname: 'test2', profileImage: null } as User;
      const diaryId = 1;
      const diary = {
        title: '제목',
        content: '<p>일기 내용</p>',
        thumbnail: '',
        emotion: '🔥',
        status: DiaryStatus.PRIVATE,
        author: user2,
      };

      (diariesRepository.findById as jest.Mock).mockResolvedValue(diary);

      // when - then
      await expect(async () => await diariesService.findDiary(user1, diaryId)).rejects.toThrow(
        new ForbiddenException('권한이 없는 사용자입니다.'),
      );
    });
  });

  describe('updateDiary', () => {
    beforeEach(() => jest.clearAllMocks());

    it('일기 수정(일기 내용 수정된 경우)', async () => {
      // given
      const diaryId = 1;
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const updateDiaryDto = { content: '<p>일기 내용 수정</p>' } as UpdateDiaryDto;
      const diary = {
        title: '제목',
        content: '<p>일기 내용</p>',
        thumbnail: '',
        emotion: '🔥',
        status: DiaryStatus.PUBLIC,
        author: user,
      } as Diary;
      const tags = [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ];

      jest.spyOn(diariesService, 'findDiary').mockResolvedValue(diary);

      (tagsService.mapTagNameToTagType as jest.Mock).mockResolvedValue(tags);
      (getSummary as jest.Mock).mockResolvedValue('수정된 일기 요약');
      (judgeOverallMood as jest.Mock).mockResolvedValue(MoodDegree.SO_SO);

      // when
      await diariesService.updateDiary(diaryId, user, updateDiaryDto);

      // then
      expect(tagsService.mapTagNameToTagType).toHaveBeenCalledTimes(1);
      expect(tagsService.updateDataSetScore).toHaveBeenCalledTimes(1);
      expect(getSummary).toHaveBeenCalledTimes(1);
      expect(judgeOverallMood).toHaveBeenCalledTimes(1);
      expect(diariesRepository.save).toHaveBeenCalledTimes(1);
      expect(diariesRepository.addDiaryEvent).toHaveBeenCalledTimes(1);
    });

    it('일기 수정(일기 내용 수정 안된 경우)', async () => {
      // given
      const diaryId = 1;
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const updateDiaryDto = { title: '제목 수정' } as UpdateDiaryDto;
      const diary = {
        title: '제목',
        content: '<p>일기 내용</p>',
        thumbnail: '',
        emotion: '🔥',
        status: DiaryStatus.PUBLIC,
        author: user,
      } as Diary;
      const tags = [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ];

      jest.spyOn(diariesService, 'findDiary').mockResolvedValue(diary);

      (tagsService.mapTagNameToTagType as jest.Mock).mockResolvedValue(tags);
      (getSummary as jest.Mock).mockResolvedValue('수정된 일기 요약');
      (judgeOverallMood as jest.Mock).mockResolvedValue(MoodDegree.SO_SO);

      // when
      await diariesService.updateDiary(diaryId, user, updateDiaryDto);

      // then
      expect(diariesService.findDiary).toHaveBeenCalledTimes(1);
      expect(tagsService.mapTagNameToTagType).toHaveBeenCalledTimes(1);
      expect(tagsService.updateDataSetScore).toHaveBeenCalledTimes(1);
      expect(getSummary).toHaveBeenCalledTimes(0);
      expect(judgeOverallMood).toHaveBeenCalledTimes(0);
      expect(diariesRepository.save).toHaveBeenCalledTimes(1);
      expect(diariesRepository.addDiaryEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteDiary', () => {
    beforeEach(() => jest.clearAllMocks());

    it('일기 삭제', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const diaryId = 1;

      jest.spyOn(diariesService, 'deleteDiary');

      // when
      await diariesService.deleteDiary(user, diaryId);

      // then
      expect(diariesService.findDiary).toHaveBeenCalledTimes(1);
      expect(diariesRepository.softDelete).toHaveBeenCalledTimes(1);
      expect(diariesRepository.addDiaryEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllDiaryEmotions', () => {
    beforeEach(() => jest.clearAllMocks());

    it('특정 기간의 감정 통계', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const userId = 1;
      const getAllEmotionsRequestDto = { startDate: '2024-01-01', lastDate: '2024-01-08' };
      const getAllEmotionsResponse = {
        emotion: '😊',
        diaryInfos: [
          {
            id: 7,
            title: '졸려',
            createdAt: new Date('2024-01-17 01:11:31.757747'),
          },
          {
            id: 6,
            title: '고양이 귀여워',
            createdAt: new Date('2024-01-15 05:16:00.363941'),
          },
        ],
      } as GetAllEmotionsResponseDto;

      (diariesRepository.findAllDiaryBetweenDates as jest.Mock).mockResolvedValue([
        getAllEmotionsResponse,
      ]);

      // when
      const result = await diariesService.findAllDiaryEmotions(
        user,
        userId,
        getAllEmotionsRequestDto,
      );

      // then
      expect(result).toHaveLength(1);
      expect(diariesRepository.findAllDiaryBetweenDates).toHaveBeenCalledTimes(1);
    });

    it('기간이 주어지지 않은 경우 감정 통계', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const userId = 1;
      const getAllEmotionsRequestDto = { startDate: undefined, lastDate: undefined };
      const getAllEmotionsResponseDto = {
        emotion: '😊',
        diaryInfos: [
          {
            id: 7,
            title: '졸려',
            createdAt: new Date('2024-01-17 01:11:31.757747'),
          },
          {
            id: 6,
            title: '고양이 귀여워',
            createdAt: new Date('2024-01-15 05:16:00.363941'),
          },
        ],
      } as GetAllEmotionsResponseDto;

      (diariesRepository.findAllDiaryBetweenDates as jest.Mock).mockResolvedValue([
        getAllEmotionsResponseDto,
      ]);

      // when
      const result = await diariesService.findAllDiaryEmotions(
        user,
        userId,
        getAllEmotionsRequestDto,
      );

      // then
      expect(result).toHaveLength(1);
      expect(diariesRepository.findAllDiaryBetweenDates).toHaveBeenCalledTimes(1);
    });
  });

  describe('findFeedDiary', () => {
    beforeEach(() => jest.clearAllMocks());

    it('피드 조회(최초 조회로 lastIndex가 undefined인 경우)', async () => {
      // given
      const userId = 1;
      const lastIndex = undefined;
      const friends = [
        { id: 2, email: 'test2', nickname: 'test2', profileImage: null },
        { id: 3, email: 'test3', nickname: 'test3', profileImage: null },
      ];
      const feedDiary = [
        {
          diaryId: 1,
          authorId: 2,
          createdAt: new Date('2024-01-17 01:11:31.757747'),
          profileImage: null,
          nickname: 'test2',
          thumbnail: null,
          title: '일기1',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          reactionCount: 2,
          leavedReaction: null,
        },
        {
          diaryId: 2,
          authorId: 2,
          createdAt: new Date('2024-01-16 01:11:31.757747'),
          profileImage: null,
          nickname: 'test2',
          thumbnail: null,
          title: '일기2',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          reactionCount: 2,
          leavedReaction: null,
        },
      ] as FeedDiaryDto[];

      (friendsService.getFriendsList as jest.Mock).mockResolvedValue(friends);
      (diariesRepository.findPaginatedDiaryByDateAndIdList as jest.Mock).mockResolvedValue(
        feedDiary,
      );

      // when
      const result = await diariesService.findFeedDiary(userId, lastIndex);

      // then
      expect(result).toBe(feedDiary);
      expect(friendsService.getFriendsList).toHaveBeenCalledTimes(1);
      expect(diariesRepository.findPaginatedDiaryByDateAndIdList).toHaveBeenCalledTimes(1);
    });

    it('피드 조회(lastIndex값이 있는 경우)', async () => {
      // given
      const userId = 1;
      const lastIndex = 11;
      const friends = [
        { id: 2, email: 'test2', nickname: 'test2', profileImage: null },
        { id: 3, email: 'test3', nickname: 'test3', profileImage: null },
      ];
      const feedDiary = [
        {
          diaryId: 12,
          authorId: 2,
          createdAt: new Date('2024-01-17 01:11:31.757747'),
          profileImage: null,
          nickname: 'test2',
          thumbnail: null,
          title: '일기1',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          reactionCount: 2,
          leavedReaction: null,
        },
        {
          diaryId: 13,
          authorId: 2,
          createdAt: new Date('2024-01-16 01:11:31.757747'),
          profileImage: null,
          nickname: 'test2',
          thumbnail: null,
          title: '일기2',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          reactionCount: 2,
          leavedReaction: null,
        },
      ] as FeedDiaryDto[];

      (friendsService.getFriendsList as jest.Mock).mockResolvedValue(friends);
      (diariesRepository.findPaginatedDiaryByDateAndIdList as jest.Mock).mockResolvedValue(
        feedDiary,
      );

      // when
      const result = await diariesService.findFeedDiary(userId, lastIndex);

      // then
      expect(result).toBe(feedDiary);
      expect(friendsService.getFriendsList).toHaveBeenCalledTimes(1);
      expect(diariesRepository.findPaginatedDiaryByDateAndIdList).toHaveBeenCalledTimes(1);
    });

    it('친구가 없는 경우 빈 배열 반환', async () => {
      // given
      const userId = 1;
      const lastIndex = undefined;
      const friends = [];

      (friendsService.getFriendsList as jest.Mock).mockResolvedValue(friends);

      // when
      const result = await diariesService.findFeedDiary(userId, lastIndex);

      // then
      expect(result).toHaveLength(0);
      expect(friendsService.getFriendsList).toHaveBeenCalledTimes(1);
      expect(diariesRepository.findPaginatedDiaryByDateAndIdList).toHaveBeenCalledTimes(0);
    });
  });

  describe('findDiaryByAuthorId', () => {
    beforeEach(() => jest.clearAllMocks());

    it('사용자 id로 일기 조회, Day 타입인 경우', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const userId = 1;
      const requestDto = {
        type: TimeUnit.Day,
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        lastIndex: null,
      };
      const diaries = [
        {
          diaryId: 1,
          thumbnail: null,
          title: '일기1',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-10 01:11:31.757747'),
        },
        {
          diaryId: 2,
          thumbnail: null,
          title: '일기2',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-11 01:11:31.757747'),
        },
      ] as AllDiaryInfosDto[];

      (usersService.findUserById as jest.Mock).mockResolvedValue(user);
      (diariesRepository.findDiariesByAuthorIdWithPagination as jest.Mock).mockResolvedValue(
        diaries,
      );

      // when
      const result = await diariesService.findDiaryByAuthorId(user, userId, requestDto);

      // then
      expect(result.nickname).toBe(user.nickname);
      expect(result.diaryList).toBe(diaries);
      expect(diariesRepository.findDiariesByAuthorIdWithPagination).toHaveBeenCalledTimes(1);
      expect(diariesRepository.findDiariesByAuthorIdWithDates).toHaveBeenCalledTimes(0);
    });

    it('사용자 id로 일기 조회, Day 타입이 아닌 경우', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const userId = 1;
      const requestDto = {
        type: TimeUnit.Month,
        startDate: '2024-01-01',
        endDate: '2024-01-15',
        lastIndex: null,
      };
      const diaries = [
        {
          diaryId: 1,
          thumbnail: null,
          title: '일기1',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-10 01:11:31.757747'),
        },
        {
          diaryId: 2,
          thumbnail: null,
          title: '일기2',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-11 01:11:31.757747'),
        },
      ] as AllDiaryInfosDto[];

      (usersService.findUserById as jest.Mock).mockResolvedValue(user);
      (diariesRepository.findDiariesByAuthorIdWithDates as jest.Mock).mockResolvedValue(diaries);

      // when
      const result = await diariesService.findDiaryByAuthorId(user, userId, requestDto);

      // then
      expect(result.nickname).toBe(user.nickname);
      expect(result.diaryList).toBe(diaries);
      expect(diariesRepository.findDiariesByAuthorIdWithPagination).toHaveBeenCalledTimes(0);
      expect(diariesRepository.findDiariesByAuthorIdWithDates).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMoodForYear', () => {
    beforeEach(() => jest.clearAllMocks());

    it('최근 1년의 일기 mood 조회', async () => {
      // given
      const userId = 1;
      const moodForYear = [
        { date: new Date('2024-01-11 01:11:31.757747'), mood: MoodDegree.BAD },
        { date: new Date('2024-01-12 01:11:31.757747'), mood: MoodDegree.GOOD },
        { date: new Date('2024-01-13 01:11:31.757747'), mood: MoodDegree.SO_BAD },
        { date: new Date('2024-01-14 01:11:31.757747'), mood: MoodDegree.SO_GOOD },
        { date: new Date('2024-01-15 01:11:31.757747'), mood: MoodDegree.SO_SO },
      ];

      (diariesRepository.findLatestDiaryByDate as jest.Mock).mockResolvedValue(moodForYear);

      // when
      const result = await diariesService.getMoodForYear(userId);

      // then
      expect(result).toBe(moodForYear);
      expect(diariesRepository.findLatestDiaryByDate).toHaveBeenCalledTimes(1);
    });
  });

  describe('findDiaryByKeywordV1', () => {
    beforeEach(() => jest.clearAllMocks());

    it('키워드로 일기 검색 V1', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const keyword = '검색';
      const lastIndex = 10;
      const diaries = [
        {
          diaryId: 11,
          thumbnail: null,
          title: '일기1',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-10 01:11:31.757747'),
        },
        {
          diaryId: 12,
          thumbnail: null,
          title: '일기2',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-11 01:11:31.757747'),
        },
      ] as AllDiaryInfosDto[];

      (diariesRepository.findDiaryByKeywordV1 as jest.Mock).mockResolvedValue(diaries);

      // when
      const result = await diariesService.findDiaryByKeywordV1(user, keyword, lastIndex);

      // then
      expect(result.nickname).toBe(user.nickname);
      expect(result.diaryList).toBe(diaries);
    });
  });

  describe('findDiaryByKeywordV2', () => {
    beforeEach(() => jest.clearAllMocks());

    it('키워드로 일기 검색 V2', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const keyword = '검색';
      const lastIndex = 10;
      const diaries = [
        {
          diaryId: 11,
          thumbnail: null,
          title: '일기1',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-10 01:11:31.757747'),
        },
        {
          diaryId: 12,
          thumbnail: null,
          title: '일기2',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-11 01:11:31.757747'),
        },
      ] as AllDiaryInfosDto[];

      (diariesRepository.findDiaryByKeywordV2 as jest.Mock).mockResolvedValue(diaries);

      // when
      const result = await diariesService.findDiaryByKeywordV2(user, keyword, lastIndex);

      // then
      expect(result.nickname).toBe(user.nickname);
      expect(result.diaryList).toBe(diaries);
    });
  });

  describe('findDiaryByKeywordV3', () => {
    beforeEach(() => jest.clearAllMocks());

    it('키워드로 일기 검색 V3', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const keyword = '검색';
      const lastIndex = 10;
      const diaries = [
        {
          authorid: 1,
          authorname: 'test1',
          diaryid: 1,
          thumbnail: null,
          title: '일기1',
          summary: '일기 요약',
          tagnames: ['tag1', 'tag2'],
          emotion: '😊',
          reactions: ['😘', '🔥'],
          reactionUsers: [1, 2],
          createdat: new Date('2024-01-11 01:11:31.757747'),
        },
      ] as SearchDiaryDataForm[];
      const allDiaryInfos = [
        {
          diaryId: 1,
          thumbnail: null,
          title: '일기1',
          summary: '일기 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-11 01:11:31.757747'),
          leavedReaction: '😘',
        },
      ];

      (diariesRepository.findDiaryByKeywordV3 as jest.Mock).mockResolvedValue(diaries);

      // when
      const result = await diariesService.findDiaryByKeywordV3(user, keyword, lastIndex);

      // then
      expect(result).toEqual(allDiaryInfos);
      expect(diariesRepository.findDiaryByKeywordV3).toHaveBeenCalledTimes(1);
    });

    it('키워드로 일기 검색 V3(태그가 없고, 사용자가 리액션을 남기지 않은 경우)', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const keyword = '검색';
      const lastIndex = 10;
      const diaries = [
        {
          authorid: 1,
          authorname: 'test1',
          diaryid: 1,
          thumbnail: null,
          title: '일기1',
          summary: '일기 요약',
          tagnames: [],
          emotion: '😊',
          reactions: ['😘', '🔥'],
          reactionUsers: [6, 2],
          createdat: new Date('2024-01-11 01:11:31.757747'),
        },
      ] as SearchDiaryDataForm[];
      const allDiaryInfos = [
        {
          diaryId: 1,
          thumbnail: null,
          title: '일기1',
          summary: '일기 요약',
          tags: [],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-11 01:11:31.757747'),
          leavedReaction: null,
        },
      ];

      (diariesRepository.findDiaryByKeywordV3 as jest.Mock).mockResolvedValue(diaries);

      // when
      const result = await diariesService.findDiaryByKeywordV3(user, keyword, lastIndex);

      // then
      expect(result).toEqual(allDiaryInfos);
      expect(diariesRepository.findDiaryByKeywordV3).toHaveBeenCalledTimes(1);
    });
  });

  describe('findDiaryByTag', () => {
    beforeEach(() => jest.clearAllMocks());

    it('태그로 일기 조회', async () => {
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const tagName = 'tag1';
      const lastIndex = undefined;
      const diaries = [
        {
          diaryId: 1,
          thumbnail: null,
          title: '일기1',
          summary: '일기 내용 요약',
          tags: ['tag1', 'tag2'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-10 01:11:31.757747'),
        },
        {
          diaryId: 2,
          thumbnail: null,
          title: '일기2',
          summary: '일기 내용 요약',
          tags: ['tag1'],
          emotion: '😊',
          reactionCount: 2,
          createdAt: new Date('2024-01-11 01:11:31.757747'),
        },
      ] as AllDiaryInfosDto[];

      (diariesRepository.findDiaryByTag as jest.Mock).mockResolvedValue(diaries);

      // when
      const result = await diariesService.findDiaryByTag(user, tagName, lastIndex);

      // then
      expect(result.nickname).toBe(user.nickname);
      expect(result.diaryList).toBe(diaries);
      expect(diariesRepository.findDiaryByTag).toHaveBeenCalledTimes(1);
    });
  });
});
