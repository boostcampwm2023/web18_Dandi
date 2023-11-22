import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { GetAllDiaryEmotionsResponseDto } from './dto/diary.dto';

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

  async findAllDiaryEmotions(
    user: User,
    isOwner: boolean,
    startDate: string,
    lastDate: string,
  ): Promise<GetAllDiaryEmotionsResponseDto[]> {
    const queryBuilder = this.createQueryBuilder('diary')
      .select(['diary.emotion as emotion', 'COUNT(diary.emotion) as emotionCount'])
      .where('diary.author.id = :userId', { userId: user.id })
      .andWhere('diary.createdAt BETWEEN :startDate AND :lastDate', { startDate, lastDate })
      .groupBy('diary.emotion');

    if (!isOwner) {
      queryBuilder.andWhere('diary.status = :status', { status: 'public' });
    }
    return await queryBuilder.getRawMany();
  }
}
