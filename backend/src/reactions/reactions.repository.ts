import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Reaction } from './entity/reaction.entity';
import { Diary } from 'src/diaries/entity/diary.entity';
import { User } from 'src/users/entity/user.entity';
import { ReactionInfoResponseDto } from './dto/reaction.dto';

@Injectable()
export class ReactionsRepository extends Repository<Reaction> {
  constructor(private dataSource: DataSource) {
    super(Reaction, dataSource.createEntityManager());
  }

  findReactionByDiaryAndUser(user: User, diary: Diary) {
    return this.findOne({
      where: {
        diary: { id: diary.id },
        user: { id: user.id },
      },
    });
  }

  findByDiary(diaryId: number): Promise<ReactionInfoResponseDto[]> {
    return this.createQueryBuilder('reaction')
      .select([
        'user.id as userId',
        'user.nickname as nickname',
        'user.profileImage as profileImage',
        'reaction.reaction as reaction',
      ])
      .where('reaction.diaryId = :diaryId', { diaryId })
      .innerJoin('reaction.user', 'user')
      .getRawMany();
  }
}
