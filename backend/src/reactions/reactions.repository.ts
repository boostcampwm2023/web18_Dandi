import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Reaction } from './entity/reaction.entity';

@Injectable()
export class ReactionsRepository extends Repository<Reaction> {
  constructor(private dataSource: DataSource) {
    super(Reaction, dataSource.createEntityManager());
  }
}
