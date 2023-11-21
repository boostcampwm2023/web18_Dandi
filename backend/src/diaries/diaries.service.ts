import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DiariesRepository } from './diaries.repository';
import { CreateDiaryDto, UpdateDiaryDto } from './dto/diary.dto';
import { User } from 'src/users/entity/user.entity';
import { TagsService } from 'src/tags/tags.service';
import { DiaryStatus } from './entity/diaryStatus';
import { Diary } from './entity/diary.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DiariesService {
  constructor(
    private readonly diariesRepository: DiariesRepository,
    private readonly tagsService: TagsService,
  ) {}

  async saveDiary(user: User, createDiaryDto: CreateDiaryDto) {
    const tags = await this.tagsService.mapTagNameToTagType(createDiaryDto.tagNames);
    const diary = plainToClass(Diary, createDiaryDto, {
      excludePrefixes: ['tag'],
    });

    diary.author = user;
    diary.tags = tags;
    diary.summary = await this.getSummary(createDiaryDto);

    await this.diariesRepository.save(diary);
  }

  async findDiary(user: User, id: number, readonlyMode: boolean) {
    const diary = await this.diariesRepository.findById(id);
    this.existsDiary(diary);

    const author = await diary.author;
    this.checkAuthorization(author, user, diary.status, readonlyMode);

    return diary;
  }

  async updateDiary(id: number, user: User, updateDiaryDto: UpdateDiaryDto) {
    const existingDiary = await this.findDiary(user, id, false);

    existingDiary.tags = await this.tagsService.mapTagNameToTagType(updateDiaryDto.tagNames);
    Object.keys(updateDiaryDto).forEach((key) => {
      if (updateDiaryDto[key]) {
        existingDiary[key] = updateDiaryDto[key];
      }
    });

    return await this.diariesRepository.save(existingDiary);
  }

  async deleteDiary(user: User, id: number) {
    await this.findDiary(user, id, false);

    await this.diariesRepository.softDelete(id);
  }

  private existsDiary(diary: Diary) {
    if (!diary) {
      throw new BadRequestException('존재하지 않는 일기입니다.');
    }
  }

  private checkAuthorization(author: User, user: User, status: DiaryStatus, readMode: boolean) {
    if ((!readMode || status === DiaryStatus.PRIVATE) && author.id !== user.id) {
      throw new ForbiddenException('권한이 없는 사용자입니다.');
    }
  }

  private async getSummary(createDiaryDto: CreateDiaryDto) {
    const response = await fetch(
      'https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize',
      {
        method: 'POST',
        headers: {
          'X-NCP-APIGW-API-KEY-ID': process.env.NCP_CLOVA_SUMMARY_API_KEY_ID,
          'X-NCP-APIGW-API-KEY': process.env.NCP_CLOVA_SUMMARY_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: {
            title: createDiaryDto.title,
            content: createDiaryDto.content,
          },
          option: { language: 'ko' },
        }),
      },
    );

    const body = await response.json();
    return body.summary;
  }
}
