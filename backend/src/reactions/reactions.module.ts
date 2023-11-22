import { Module } from '@nestjs/common';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { ReactionsRepository } from './reactions.repository';
import { DiariesModule } from 'src/diaries/diaries.module';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService, ReactionsRepository],
  imports: [DiariesModule],
})
export class ReactionsModule {}
