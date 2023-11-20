import { Module } from '@nestjs/common';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { DiariesRepository } from './diaries.repository';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  controllers: [DiariesController],
  providers: [DiariesService, DiariesRepository],
  imports: [TagsModule],
})
export class DiariesModule {}
