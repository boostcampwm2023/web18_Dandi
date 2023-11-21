import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { Injectable } from '@nestjs/common';

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
}
