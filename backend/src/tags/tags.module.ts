import { Module } from '@nestjs/common';
import { TagsRepository } from './tag.repository';
import { TagsService } from './tags.service';

@Module({
  providers: [TagsService, TagsRepository],
  exports: [TagsService],
})
export class TagsModule {}
