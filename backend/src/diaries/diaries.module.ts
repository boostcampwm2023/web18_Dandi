import { Module } from '@nestjs/common';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { DiariesRepository } from './diaries.repository';
import { TagsModule } from 'src/tags/tags.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  controllers: [DiariesController],
  providers: [DiariesService, DiariesRepository],
  imports: [TagsModule, FriendsModule],
  exports: [DiariesService],
})
export class DiariesModule {}
