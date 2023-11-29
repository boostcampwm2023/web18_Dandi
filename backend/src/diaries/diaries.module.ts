import { Module } from '@nestjs/common';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { DiariesRepository } from './diaries.repository';
import { TagsModule } from 'src/tags/tags.module';
import { FriendsModule } from 'src/friends/friends.module';
import { UsersModule } from 'src/users/users.module';
import { DiariesImageService } from './diariesImage.service';

@Module({
  controllers: [DiariesController],
  providers: [DiariesService, DiariesRepository, DiariesImageService],
  imports: [TagsModule, UsersModule, FriendsModule],
  exports: [DiariesService],
})
export class DiariesModule {}
