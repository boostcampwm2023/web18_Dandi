import { Injectable } from '@nestjs/common';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async mapTagNameToTagType(tagNames: string[]) {
    if (!tagNames) return null;

    return Promise.all(
      tagNames.map(async (tagName) => {
        const savedTag = await this.tagsRepository.findByName(tagName);

        if (!savedTag) {
          return this.tagsRepository.saveTag(tagName);
        }
        return savedTag;
      }),
    );
  }

  async updateDataSetScore(userId: number, tagNames: string[]) {
    Promise.all([
      tagNames.forEach(async (tag) => {
        const tagScore = await this.tagsRepository.zscore(`${userId}`, tag);

        if (!tagScore) {
          this.tagsRepository.zadd(`${userId}`, tag); // 데이터셋에 추가
        } else {
          this.tagsRepository.zincrby(`${userId}`, tag); // 점수 +1
        }
      }),
    ]);
  }

  async recommendKeywords(userId: number, keyword: string) {
    const tags = await this.tagsRepository.zrange(`${userId}`, 0, -1);
    const keywords = tags.filter((tag) => tag.includes(keyword));

    return keywords.reverse();
  }
}
