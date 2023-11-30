import { Module } from '@nestjs/common';
import { DiariesController } from './diaries.controller';
import { DiariesService } from './diaries.service';
import { DiariesRepository } from './diaries.repository';
import { TagsModule } from 'src/tags/tags.module';
import { FriendsModule } from 'src/friends/friends.module';
import { UsersModule } from 'src/users/users.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  controllers: [DiariesController],
  providers: [DiariesService, DiariesRepository],
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE,
    }),
    TagsModule,
    UsersModule,
    FriendsModule,
  ],
  exports: [DiariesService],
})
export class DiariesModule {}
