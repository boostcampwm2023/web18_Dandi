import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsService } from './reactions.service';
import { ReactionsRepository } from './reactions.repository';
import { DiariesService } from 'src/diaries/diaries.service';

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

    it('diary id에 대한 결과 반환', async () => {
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
});
