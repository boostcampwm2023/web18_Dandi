import { Injectable } from '@nestjs/common';
import { ReactionsRepository } from './reactions.repository';
import { User } from 'src/users/entity/user.entity';
import { CreateReactionDto } from './dto/reaction.dto';
import { DiariesService } from 'src/diaries/diaries.service';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly reactionsRepository: ReactionsRepository,
    private readonly diariesService: DiariesService,
  ) {}

  async getReaction(user: User, diaryId: number) {
    const diary = await this.diariesService.findDiary(user, diaryId, true);

    return await this.reactionsRepository.findByDiary(diary);
  }

  async saveReaction(user: User, diaryId: number, createReactionDto: CreateReactionDto) {
    const diary = await this.diariesService.findDiary(user, diaryId, true);

    this.reactionsRepository.save({ user, diary, reaction: createReactionDto.reaction });
  }
}
