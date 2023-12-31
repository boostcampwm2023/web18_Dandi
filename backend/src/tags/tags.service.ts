import { Injectable } from '@nestjs/common';
import { TagsRepository } from '../tags/tag.repository';
// import { InjectRedis } from '@liaoliaots/nestjs-redis';
// import { Redis } from 'ioredis';

@Injectable()
export class TagsService {
  constructor(
    private readonly tagsRepository: TagsRepository,
    // @InjectRedis() private readonly redis: Redis,
  ) {}

  async mapTagNameToTagType(tagNames: string[]) {
    if (!tagNames) return null;

    return await Promise.all(
      tagNames.map(async (tagName) => {
        let tag = await this.tagsRepository.findByName(tagName);

        if (!tag) {
          tag = await this.tagsRepository.saveTag(tagName);
        }
        return tag;
      }),
    );
  }

  updateDataSetScore(userId: number, tagNames: string[]) {
    tagNames.forEach(async (tag) => {
      const tagScore = await this.tagsRepository.zscore(`${userId}`, tag);

      if (!tagScore) {
        this.tagsRepository.zadd(`${userId}`, tag); // 데이터셋에 추가
      } else {
        this.tagsRepository.zincrby(`${userId}`, tag); // 점수 +1
      }
    });
  }

  async recommendKeywords(userId: number, keyword: string) {
    const tags = await this.tagsRepository.zrange(`${userId}`, 0, -1);
    const keywords = tags.filter((tag) => tag.includes(keyword));

    return keywords.reverse();
  }
}
