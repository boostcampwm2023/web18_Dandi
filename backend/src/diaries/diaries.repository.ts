import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';
import { GetAllEmotionsResponseDto, ReadUserDiariesRequestDto } from './dto/diary.dto';

const ITEM_PER_PAGE = 5;

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

  async findDiaryByAuthorIdWithPagination(
    authorId: number,
    isOwner: boolean,
    requestDto: ReadUserDiariesRequestDto,
  ) {
    const queryBuilder = this.createQueryBuilder('diary')
      .where('diary.author.id = :authorId', {
        authorId,
      })
      .andWhere('diary.id < :lastIndex', { lastIndex: requestDto.lastIndex })
      .orderBy('diary.id', 'DESC')
      .limit(ITEM_PER_PAGE);

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }
    return await queryBuilder.getRawMany();
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
}
