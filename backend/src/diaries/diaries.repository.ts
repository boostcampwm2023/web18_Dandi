import { DataSource, Repository } from 'typeorm';
import { Diary } from './entity/diary.entity';
import { CreateDiaryDto } from './dto/diary.dto';
import { User } from 'src/users/entity/user.entity';
import { Tag } from '../tags/entity/tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiariesRepository extends Repository<Diary> {
  constructor(private dataSource: DataSource) {
    super(Diary, dataSource.createEntityManager());
  }

  async saveDiary(user: User, createDiaryDto: CreateDiaryDto, tags: Tag[]): Promise<Diary> {
    const { title, content, thumbnail, emotion, mood, status } = createDiaryDto;

    return await this.save({
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
    return await this.createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .where('diary.id = :id', { id })
      .getOne();
  }
}
