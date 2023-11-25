import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { GetAllEmotionsResponseDto } from './dto/diary.dto';
import { DiaryStatus } from './entity/diaryStatus';

@Injectable()
export class DiariesRepository extends Repository<Diary> {
  constructor(private dataSource: DataSource) {
    super(Diary, dataSource.createEntityManager());
  }

  async findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  async findAllDiaryBetweenDates(
    userId: number,
    isOwner: boolean,
    startDate: string,
    lastDate: string,
  ): Promise<Diary[]> {
    const queryBuilder = this.createQueryBuilder('diary')
      .where('diary.author.id = :userId', { userId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :lastDate', { startDate, lastDate });

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    return queryBuilder.getMany();
  }

  async findPaginatedDiaryByDateAndIdList(
    date: Date,
    idList: number[],
    pageSize: number,
    lastIndex: number | undefined,
  ) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'user')
      .leftJoinAndSelect('diary.tags', 'tags')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .leftJoinAndSelect('reactions.user', 'reactionUser')
      .where('diary.author IN (:...idList)', { idList })
      .andWhere('diary.createdAt > :date', { date })
      .andWhere('diary.status = :status', { status: DiaryStatus.PUBLIC })
      .orderBy('diary.id', 'DESC')
      .limit(pageSize);

    if (lastIndex !== undefined) {
      queryBuilder.where('diary.id < :lastIndex', { lastIndex });
    }

    return await queryBuilder.getMany();
  }
}
