import { Module } from '@nestjs/common';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { DiariesRepository } from './diaries.repository';
import { TagsRepository } from './tag.repository';

@Module({
  controllers: [DiariesController],
  providers: [DiariesService, DiariesRepository, TagsRepository],
})
export class DiariesModule {}
