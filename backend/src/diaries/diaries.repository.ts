import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { CreateDiaryDto, ReadUserDiariesDto } from './dto/diary.dto';
import { User } from 'src/users/entity/user.entity';
import { Tag } from '../tags/entity/tag.entity';
import { Injectable } from '@nestjs/common';
import { DiaryStatus } from './entity/diaryStatus';

const ITEM_PER_PAGE = 5;

@Injectable()
export class DiariesRepository extends Repository<Diary> {
  constructor(private dataSource: DataSource) {
    super(Diary, dataSource.createEntityManager());
  }

  async saveDiary(user: User, createDiaryDto: CreateDiaryDto, tags: Tag[]): Promise<Diary> {
    const { title, content, thumbnail, emotion, mood, status } = createDiaryDto;

    return this.save({
      title,
      content,
      thumbnail,
      emotion,
      mood,
      tags,
      status,
      author: user,
    });
  }

  async findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  async findByAuthorId(authorId: number, status: DiaryStatus, dto: ReadUserDiariesDto) {
    const { startDate, endDate } = dto;

    return this.createQueryBuilder('diary')
      .where('diary.status = :status', { status })
      .andWhere('diary.authorId = :authorId', { authorId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();
  }

  async findByAuthorIdWithPaging(authorId: number, status: DiaryStatus, dto: ReadUserDiariesDto) {
    return this.createQueryBuilder('diary')
      .where('diary.status = :status', { status })
      .andWhere('diary.authorId = :authorId', { authorId })
      .skip(dto.page * ITEM_PER_PAGE)
      .take(ITEM_PER_PAGE)
      .getMany();
  }
}
