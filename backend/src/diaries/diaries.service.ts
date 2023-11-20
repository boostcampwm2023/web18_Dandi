import { Injectable } from '@nestjs/common';
import { DiariesRepository } from './diaries.repository';
import { CreateDiaryDto } from './dto/diary.dto';
import { TagsRepository } from './tag.repository';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class DiariesService {
  constructor(
    private readonly diariesRepository: DiariesRepository,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async saveDiary(user: User, createDiaryDto: CreateDiaryDto) {
    const tags = await this.mapTagNameToTagType(createDiaryDto.tagNames);

    await this.diariesRepository.saveDiary(user, createDiaryDto, tags);
  }

  async mapTagNameToTagType(tagNames: string[]) {
    if (!tagNames) return null;
    console.log(tagNames);

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
