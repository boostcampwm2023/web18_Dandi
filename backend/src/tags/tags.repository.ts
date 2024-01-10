import { DataSource, Repository } from 'typeorm';
import { Tag } from './entity/tag.entity';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class TagsRepository extends Repository<Tag> {
  constructor(
    private dataSource: DataSource,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super(Tag, dataSource.createEntityManager());
  }

  async findByName(name: string) {
    return await this.createQueryBuilder('tag').where('tag.name = :name', { name }).getOne();
  }

  async saveTag(name: string) {
    return await this.save({ name });
  }

  zscore(key: string, tagName: string) {
    return this.redis.zscore(key, tagName);
  }

  zadd(key: string, tagName: string) {
    return this.redis.zadd(key, 1, tagName);
  }

  zincrby(key: string, tagName: string) {
    return this.redis.zincrby(key, 1, tagName);
  }

  zrange(key: string, startIndex: number, endIndex: number) {
    return this.redis.zrange(key, startIndex, endIndex);
  }
}
