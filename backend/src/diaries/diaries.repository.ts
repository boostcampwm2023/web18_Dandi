import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';

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

  async findAllDiaryEmotions(user: User, isOwner: boolean, startDate: string, lastDate: string) {
    const queryBuilder = this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .where('author.id = :userId', { user })
      .andWhere('diary.createdAt BETWEEN :start AND :last', { startDate, lastDate })
      .groupBy('diary.emotion');

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'PRIVATE' });
    }
    console.log((await queryBuilder).getRawMany());
    return await queryBuilder.getMany();
  }
}
