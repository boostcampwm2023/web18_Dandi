import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DiariesRepository } from './diaries.repository';
import { CreateDiaryDto, UpdateDiaryDto } from './dto/diary.dto';
import { User } from 'src/users/entity/user.entity';
import { TagsService } from 'src/tags/tags.service';
import { DiaryStatus } from './entity/diaryStatus';
import { Diary } from './entity/diary.entity';

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

  async findDiary(user: User, id: number) {
    const diary = await this.diariesRepository.findById(id);
    this.existsDiary(diary);

    const author = await diary.author;
    this.checkAuthorization(author, user, true);

    return diary;
  }

  async updateDiary(id: number, user: User, updateDiaryDto: UpdateDiaryDto) {
    const existingDiary = await this.diariesRepository.findById(id);
    this.existsDiary(existingDiary);

    const author = await existingDiary.author;
    this.checkAuthorization(author, user);

    existingDiary.tags = await this.tagsService.mapTagNameToTagType(updateDiaryDto.tagNames);
    Object.keys(updateDiaryDto).forEach((key) => {
      if (updateDiaryDto[key]) {
        existingDiary[key] = updateDiaryDto[key];
      }
    });

    return await this.diariesRepository.save(existingDiary);
  }

  async deleteDiary(user: User, id: number) {
    const diary = await this.diariesRepository.findById(id);
    this.existsDiary(diary);

    const author = await diary.author;
    this.checkAuthorization(author, user);

    await this.diariesRepository.softDelete(id);
  }

  private existsDiary(diary: Diary) {
    if (!diary) {
      throw new BadRequestException('존재하지 않는 일기입니다.');
    }
  }

  private checkAuthorization(author: User, user: User, status: DiaryStatus = DiaryStatus.PUBLIC) {
    if (status === DiaryStatus.PRIVATE && author.id !== user.id) {
      throw new ForbiddenException('권한이 없는 사용자입니다.');
    }
  }
}
