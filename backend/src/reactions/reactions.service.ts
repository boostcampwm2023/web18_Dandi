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

  async saveReaction(user: User, diaryId: number, createReactionDto: CreateReactionDto) {
    const diary = await this.diariesService.findDiary(user, diaryId, true);

    this.reactionsRepository.save({ user, diary, reaction: createReactionDto.reaction });
  }
}
