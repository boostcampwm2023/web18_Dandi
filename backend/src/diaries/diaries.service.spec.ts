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
import { GetDiaryResponseDto, UpdateDiaryDto } from './dto/diary.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Diary } from './entity/diary.entity';

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
});
