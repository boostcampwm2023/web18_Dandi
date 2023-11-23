import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';

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

  async findDiariesByAuthorIdWithPagination(authorId: number, isOwner: boolean, lastIndex: number) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoin('diary.tags', 'tags')
      .leftJoin('diary.reactions', 'reactions')
      .where('diary.author.id = :authorId', {
        authorId,
      })
      .andWhere('diary.id < :lastIndex', { lastIndex })
      .orderBy('diary.id', 'DESC')
      .limit(ITEM_PER_PAGE);

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }
    return await queryBuilder.getMany();
  }

  async findDiariesByAuthorIdWithDates(
    authorId: number,
    isOwner: boolean,
    startDate: string,
    lastDate: string,
  ) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.tags', 'tags')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .where('diary.author.id = :authorId', { authorId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :lastDate', { startDate, lastDate })
      .orderBy('diary.id', 'DESC');

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    return queryBuilder.getMany();
  }

  async findAllDiaryBetweenDates(
    userId: number,
    isOwner: boolean,
    startDate: string,
    lastDate: string,
  ): Promise<Diary[]> {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.tags', 'tags')
      .leftJoinAndSelect('diary.reactions', 'reactions')
      .where('diary.author.id = :userId', { userId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :lastDate', { startDate, lastDate });

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }

    return queryBuilder.getMany();
  }
}
