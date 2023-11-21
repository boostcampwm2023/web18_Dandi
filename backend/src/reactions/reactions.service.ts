import { BadRequestException, Injectable } from '@nestjs/common';
import { ReactionsRepository } from './reactions.repository';
import { User } from 'src/users/entity/user.entity';
import { CreateReactionDto } from './dto/reaction.dto';
import { DiariesRepository } from 'src/diaries/diaries.repository';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly reactionsRepository: ReactionsRepository,
    private readonly diariesRepository: DiariesRepository,
  ) {}

  async saveReaction(user: User, diaryId: number, createReactionDto: CreateReactionDto) {
    const diary = await this.diariesRepository.findById(diaryId);
    if (!diary) {
      throw new BadRequestException('존재하지 않는 일기 정보입니다.');
    }

    this.reactionsRepository.save({ user, diary, reaction: createReactionDto.reaction });
  }
}
