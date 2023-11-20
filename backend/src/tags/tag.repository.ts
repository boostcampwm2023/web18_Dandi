import { DataSource, Repository } from 'typeorm';
import { Tag } from './entity/tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsRepository extends Repository<Tag> {
  constructor(private dataSource: DataSource) {
    super(Tag, dataSource.createEntityManager());
  }

  async findByName(name: string) {
    return await this.createQueryBuilder('tag').where('tag.name = :name', { name }).getOne();
  }

  async saveTag(name: string) {
    return await this.save({ name });
  }
}
