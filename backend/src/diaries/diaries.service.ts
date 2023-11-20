import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DiariesRepository } from './diaries.repository';
import { CreateDiaryDto } from './dto/diary.dto';
import { User } from 'src/users/entity/user.entity';
import { TagsService } from 'src/tags/tags.service';
import { DiaryStatus } from './entity/diaryStatus';

@Injectable()
export class DiariesService {
  constructor(
    private readonly diariesRepository: DiariesRepository,
    private readonly tagsService: TagsService,
  ) {}

  async saveDiary(user: User, createDiaryDto: CreateDiaryDto) {
    const tags = await this.tagsService.mapTagNameToTagType(createDiaryDto.tagNames);

    await this.diariesRepository.saveDiary(user, createDiaryDto, tags);
  }

  async deleteDiary(user: User, id: number) {
    const diary = await this.diariesRepository.findById(id);
    const author = await diary.author;

    if (!diary) {
      throw new BadRequestException('존재하지 않는 일기입니다.');
    }
    if (diary.status === DiaryStatus.PRIVATE && author.id !== user.id) {
      throw new ForbiddenException('삭제 권한이 없는 사용자입니다.');
    }

    await this.diariesRepository.softDelete(id);
  }
}
