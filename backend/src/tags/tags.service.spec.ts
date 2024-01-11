import { Test, TestingModule } from '@nestjs/testing';
import { TagsRepository } from './tags.repository';
import { TagsService } from './tags.service';

jest.mock('./tags.repository');

describe('TagsService Test', () => {
  let tagsService: TagsService;
  let tagsRepository: TagsRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsService, TagsRepository],
    }).compile();

    tagsService = module.get<TagsService>(TagsService);
    tagsRepository = module.get<TagsRepository>(TagsRepository);
  });

  describe('String -> Tag 타입 변환 테스트', () => {
    beforeEach(() => jest.clearAllMocks());

    it('태그 이름이 DB에 존재하면 saveTag 호출 X, 배열 형태로 반환', async () => {
      //given
      const tagNames = ['tag1', 'tag2', 'tag3'];
      (tagsRepository.findByName as jest.Mock).mockImplementation((tagName) => {
        return {
          id: 1,
          name: tagName,
          diaries: null,
        };
      });

      //when
      const result = await tagsService.mapTagNameToTagType(tagNames);

      //then
      expect(result).toHaveLength(tagNames.length);
      expect(result.map((t) => t.name)).toEqual(tagNames);
      expect(tagsRepository.findByName).toHaveBeenCalledTimes(tagNames.length);
      expect(tagsRepository.saveTag).toHaveBeenCalledTimes(0);
    });

    it('태그 이름이 DB에 존재하지 않으면 saveTag 호출, 배열 형태로 반환', async () => {
      //given
      const tagNames = ['tag1', 'tag2', 'tag3'];
      (tagsRepository.findByName as jest.Mock).mockResolvedValue(null);
      (tagsRepository.saveTag as jest.Mock).mockImplementation((tagName) => {
        return {
          id: 1,
          name: tagName,
          diaries: null,
        };
      });

      //when
      const result = await tagsService.mapTagNameToTagType(tagNames);

      //then
      expect(result).toHaveLength(tagNames.length);
      expect(result.map((t) => t.name)).toEqual(tagNames);
      expect(tagsRepository.findByName).toHaveBeenCalledTimes(tagNames.length);
      expect(tagsRepository.saveTag).toHaveBeenCalledTimes(tagNames.length);
    });

    it('태그 이름 배열이 비었다면, 빈 배열 반환', async () => {
      //given
      const tagNames = [];

      //when
      const result = await tagsService.mapTagNameToTagType(tagNames);

      //then
      expect(result).toHaveLength(0);
      expect(tagsRepository.findByName).toHaveBeenCalledTimes(0);
      expect(tagsRepository.saveTag).toHaveBeenCalledTimes(0);
    });
  });

  describe('태그 추천 점수 갱신 테스트', () => {
    beforeEach(() => jest.clearAllMocks());

    it('사용자 ID에 해당 태그 이름이 이미 존재하면, 점수 증가 ', async () => {
      //given
      const userId = 1;
      const tagNames = ['tag1', 'tag2'];

      (tagsRepository.zscore as jest.Mock).mockResolvedValue('1');

      //when
      await tagsService.updateDataSetScore(userId, tagNames);

      //then
      expect(tagsRepository.zscore).toHaveBeenCalledTimes(tagNames.length);
      expect(tagsRepository.zadd).toHaveBeenCalledTimes(0);
      expect(tagsRepository.zincrby).toHaveBeenCalledTimes(tagNames.length);
    });

    it('사용자 ID에 해당 태그 이름이 이미 존재하지 않으면, 데이터 추가', async () => {
      //given
      const userId = 1;
      const tagNames = ['tag1', 'tag2'];

      (tagsRepository.zscore as jest.Mock).mockResolvedValue(null);

      //when
      await tagsService.updateDataSetScore(userId, tagNames);

      //then
      expect(tagsRepository.zscore).toHaveBeenCalledTimes(tagNames.length);
      expect(tagsRepository.zadd).toHaveBeenCalledTimes(tagNames.length);
      expect(tagsRepository.zincrby).toHaveBeenCalledTimes(0);
    });
  });

  describe('태그 검색어 추천 테스트', () => {
    beforeEach(() => jest.clearAllMocks());

    it('사용자 id에 태그 정보가 존재하면, 키워드와 일치하는 정보 반환', async () => {
      //given
      const userId = 1;
      const keyword = 'tag';
      const tagsStartWithTag = ['tag1', 'tag2'];
      const tagsStartWithDandi = ['dandi1', 'dandi2'];

      (tagsRepository.zrange as jest.Mock).mockResolvedValue([
        ...tagsStartWithTag,
        ...tagsStartWithDandi,
      ]);

      //when
      const result = await tagsService.recommendKeywords(userId, keyword);

      //then
      expect(result).toEqual(tagsStartWithTag.reverse());
      expect(result).toHaveLength(tagsStartWithTag.length);
      expect(tagsRepository.zrange).toHaveBeenCalledTimes(1);
    });

    it('사용자 id에 태그 정보가 존재하지 않으면, 빈 배열 반환', async () => {
      //given
      const userId = 1;
      const keyword = 'tag';

      (tagsRepository.zrange as jest.Mock).mockResolvedValue([]);

      //when
      const result = await tagsService.recommendKeywords(userId, keyword);

      //then
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(tagsRepository.zrange).toHaveBeenCalledTimes(1);
    });
  });
});
