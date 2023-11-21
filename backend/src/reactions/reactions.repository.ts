import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Reaction } from './entity/reaction.entity';
import { Diary } from 'src/diaries/entity/diary.entity';

@Injectable()
export class ReactionsRepository extends Repository<Reaction> {
  constructor(private dataSource: DataSource) {
    super(Reaction, dataSource.createEntityManager());
  }

  async findByDiary(diary: Diary) {
    return this.find({
      where: {
        diary: { id: diary.id },
      },
      relations: ['user'],
    });
  }
}
