import { Injectable } from '@nestjs/common';
import { TagsRepository } from '../tags/tag.repository';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

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
}
