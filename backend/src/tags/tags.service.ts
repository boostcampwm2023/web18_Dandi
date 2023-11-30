import { Injectable } from '@nestjs/common';
import { TagsRepository } from '../tags/tag.repository';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class TagsService {
  constructor(
    private readonly tagsRepository: TagsRepository,
    @InjectRedis() private readonly redis: Redis,
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
      const tagScore = await this.redis.zscore(`${userId}`, tag);

      if (!tagScore) {
        this.redis.zadd(`${userId}`, 1, tag); // 데이터셋에 추가
      } else {
        this.redis.zincrby(`${userId}`, 1, tag); // 점수 +1
      }
    });
  }

  async recommendKeywords(userId: number, keyword: string) {
    const tags = await this.redis.zrange(`${userId}`, 0, -1);
    const keywords = tags.filter((tag) => tag.includes(keyword));

    return keywords.reverse();
  }
}
