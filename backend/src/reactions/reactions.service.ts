import { BadRequestException, Injectable } from '@nestjs/common';
import { ReactionsRepository } from './reactions.repository';
import { User } from 'src/users/entity/user.entity';
import { ReactionRequestDto } from './dto/reaction.dto';
import { DiariesService } from 'src/diaries/diaries.service';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly reactionsRepository: ReactionsRepository,
    private readonly diariesService: DiariesService,
  ) {}

  async getAllReaction(user: User, diaryId: number) {
    const diary = await this.diariesService.findDiary(user, diaryId, true);

    return await this.reactionsRepository.findByDiary(diary);
  }

  async saveReaction(user: User, diaryId: number, reactionRequestDto: ReactionRequestDto) {
    const diary = await this.diariesService.findDiary(user, diaryId, true);

    const duplicateReaction = await this.reactionsRepository.findReactionByDiaryAndUserAndReaction(
      user,
      diary,
      reactionRequestDto.reaction,
    );
    if (duplicateReaction) {
      throw new BadRequestException('이미 저장된 리액션 정보입니다.');
    }

    this.reactionsRepository.save({ user, diary, reaction: reactionRequestDto.reaction });
  }

  async deleteReaction(user: User, diaryId: number, reactionRequestDto: ReactionRequestDto) {
    const diary = await this.diariesService.findDiary(user, diaryId, true);
    const reaction = await this.reactionsRepository.findReactionByDiaryAndUserAndReaction(
      user,
      diary,
      reactionRequestDto.reaction,
    );

    if (!reaction) {
      throw new BadRequestException('이미 삭제된 리액션 정보입니다.');
    }

    this.reactionsRepository.remove(reaction);
  }
}
