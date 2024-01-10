import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsService } from './reactions.service';
import { ReactionsRepository } from './reactions.repository';
import { DiariesService } from 'src/diaries/diaries.service';
import { User } from 'src/users/entity/user.entity';
import { ReactionRequestDto } from './dto/reaction.dto';
import { Diary } from 'src/diaries/entity/diary.entity';
import { MoodDegree } from 'src/diaries/utils/diaries.constant';
import { DiaryStatus } from 'src/diaries/entity/diaryStatus';
import { Reaction } from './entity/reaction.entity';
import { BadRequestException } from '@nestjs/common';

jest.mock('./reactions.repository');
jest.mock('src/diaries/diaries.service');

describe('ReactionsService', () => {
  let reactionsService: ReactionsService;
  let reactionsRepository: ReactionsRepository;
  let diariesService: DiariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionsService, ReactionsRepository, DiariesService],
    }).compile();

    reactionsService = module.get<ReactionsService>(ReactionsService);
    reactionsRepository = module.get<ReactionsRepository>(ReactionsRepository);
    diariesService = module.get<DiariesService>(DiariesService);
  });

  describe('getAllReaction', () => {
    beforeEach(() => jest.clearAllMocks());

    it('diary id에 대한 리액션 및 리액션의 사용자 정보 조회', async () => {
      const diaryId = 1;
      const reactions = [
        {
          userId: 1,
          nickname: 'test1',
          profileImage: 'test1',
          reaction: '💜',
        },
        {
          userId: 2,
          nickname: 'test1',
          profileImage: 'test1',
          reaction: '🤩',
        },
      ];

      (reactionsRepository.findByDiary as jest.Mock).mockResolvedValue(reactions);

      expect(await reactionsService.getAllReaction(diaryId)).toBe(reactions);
      expect(reactionsRepository.findByDiary).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveReaction', () => {
    beforeEach(() => jest.clearAllMocks());

    it('리액션 저장', async () => {
      const user = {
        id: 1,
        email: 'test1',
        nickname: 'test1',
        profileImage: null,
      } as User;
      const diaryId = 1;
      const diary = {
        id: 1,
        title: 'title',
        content: '<p>content</p>',
        summary: 'summary',
        thumbnail: '',
        emotion: '🥹',
        mood: MoodDegree.SO_SO,
        status: DiaryStatus.PUBLIC,
      } as Diary;
      const reactionRequestDto = { reaction: '💝' } as ReactionRequestDto;

      (diariesService.findDiary as jest.Mock).mockResolvedValue(diary);
      (reactionsRepository.findReactionByDiaryAndUser as jest.Mock).mockResolvedValue(null);

      await reactionsService.saveReaction(user, diaryId, reactionRequestDto);
      expect(reactionsRepository.save).toHaveBeenCalledTimes(1);
      expect(reactionsRepository.addDiaryEvent).toHaveBeenCalledTimes(1);
    });

    it('이미 해당 일기에 리액션을 한 경우 예외 발생', () => {
      const user = {
        id: 1,
        email: 'test1',
        nickname: 'test1',
        profileImage: null,
      } as User;
      const diaryId = 1;
      const diary = {
        id: 1,
        title: 'title',
        content: '<p>content</p>',
        summary: 'summary',
        thumbnail: '',
        emotion: '🥹',
        mood: MoodDegree.SO_SO,
        status: DiaryStatus.PUBLIC,
      } as Diary;
      const reactionRequestDto = { reaction: '💝' } as ReactionRequestDto;
      const reaction = { id: 1, reaction: '🔥' } as Reaction;

      (diariesService.findDiary as jest.Mock).mockResolvedValue(diary);
      (reactionsRepository.findReactionByDiaryAndUser as jest.Mock).mockResolvedValue(reaction);

      expect(reactionsService.saveReaction(user, diaryId, reactionRequestDto)).rejects.toThrow(
        new BadRequestException('이미 해당 글에 리액션을 남겼습니다.'),
      );

      expect(reactionsRepository.save).toHaveBeenCalledTimes(0);
      expect(reactionsRepository.addDiaryEvent).toHaveBeenCalledTimes(0);
    });
  });

  describe('updateReaction', () => {
    beforeEach(() => jest.clearAllMocks());

    it('리액션 수정', async () => {
      const user = {
        id: 1,
        email: 'test1',
        nickname: 'test1',
        profileImage: null,
      } as User;
      const diaryId = 1;
      const diary = {
        id: 1,
        title: 'title',
        content: '<p>content</p>',
        summary: 'summary',
        thumbnail: '',
        emotion: '🥹',
        mood: MoodDegree.SO_SO,
        status: DiaryStatus.PUBLIC,
      } as Diary;
      const reactionRequestDto = { reaction: '💝' } as ReactionRequestDto;
      const reaction = { id: 2, reaction: '😊' } as Reaction;

      (diariesService.findDiary as jest.Mock).mockResolvedValue(diary);
      (reactionsRepository.findReactionByDiaryAndUser as jest.Mock).mockResolvedValue(reaction);

      await reactionsService.updateReaction(user, diaryId, reactionRequestDto);

      expect(reactionsRepository.save).toHaveBeenCalledTimes(1);
      expect(reactionsRepository.addDiaryEvent).toHaveBeenCalledTimes(1);
    });

    it('리액션을 남긴 기록이 없는 경우 예외 발생', () => {
      const user = {
        id: 1,
        email: 'test1',
        nickname: 'test1',
        profileImage: null,
      } as User;
      const diaryId = 1;
      const diary = {
        id: 1,
        title: 'title',
        content: '<p>content</p>',
        summary: 'summary',
        thumbnail: '',
        emotion: '🥹',
        mood: MoodDegree.SO_SO,
        status: DiaryStatus.PUBLIC,
      } as Diary;
      const reactionRequestDto = { reaction: '💝' } as ReactionRequestDto;

      (diariesService.findDiary as jest.Mock).mockResolvedValue(diary);
      (reactionsRepository.findReactionByDiaryAndUser as jest.Mock).mockResolvedValue(null);

      expect(reactionsService.updateReaction(user, diaryId, reactionRequestDto)).rejects.toThrow(
        new BadRequestException('리액션 기록이 존재하지 않습니다.'),
      );
      expect(reactionsRepository.save).toHaveBeenCalledTimes(0);
      expect(reactionsRepository.addDiaryEvent).toHaveBeenCalledTimes(0);
    });
  });

  describe('deleteReaction', () => {
    beforeEach(() => jest.clearAllMocks());

    it('리액션 삭제', async () => {
      const user = {
        id: 1,
        email: 'test1',
        nickname: 'test1',
        profileImage: null,
      } as User;
      const diaryId = 1;
      const diary = {
        id: 1,
        title: 'title',
        content: '<p>content</p>',
        summary: 'summary',
        thumbnail: '',
        emotion: '🥹',
        mood: MoodDegree.SO_SO,
        status: DiaryStatus.PUBLIC,
      } as Diary;
      const reactionRequestDto = { reaction: '💝' } as ReactionRequestDto;
      const reaction = { id: 2, reaction: '💝' } as Reaction;

      (diariesService.findDiary as jest.Mock).mockResolvedValue(diary);
      (reactionsRepository.findReactionByDiaryAndUserAndReaction as jest.Mock).mockResolvedValue(
        reaction,
      );

      await reactionsService.deleteReaction(user, diaryId, reactionRequestDto);

      expect(reactionsRepository.remove).toHaveBeenCalledTimes(1);
      expect(reactionsRepository.addDiaryEvent).toHaveBeenCalledTimes(1);
    });

    it('삭제하려는 리액션이 없는 경우 예외 발생', () => {
      const user = {
        id: 1,
        email: 'test1',
        nickname: 'test1',
        profileImage: null,
      } as User;
      const diaryId = 1;
      const diary = {
        id: 1,
        title: 'title',
        content: '<p>content</p>',
        summary: 'summary',
        thumbnail: '',
        emotion: '🥹',
        mood: MoodDegree.SO_SO,
        status: DiaryStatus.PUBLIC,
      } as Diary;
      const reactionRequestDto = { reaction: '💝' } as ReactionRequestDto;

      (diariesService.findDiary as jest.Mock).mockResolvedValue(diary);
      (reactionsRepository.findReactionByDiaryAndUserAndReaction as jest.Mock).mockResolvedValue(
        null,
      );

      expect(reactionsService.deleteReaction(user, diaryId, reactionRequestDto)).rejects.toThrow(
        new BadRequestException('이미 삭제된 리액션 정보입니다.'),
      );
      expect(reactionsRepository.remove).toHaveBeenCalledTimes(0);
      expect(reactionsRepository.addDiaryEvent).toHaveBeenCalledTimes(0);
    });
  });
});
