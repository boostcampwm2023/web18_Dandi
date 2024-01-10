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
});
