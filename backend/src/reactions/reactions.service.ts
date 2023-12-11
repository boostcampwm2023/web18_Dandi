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

  getAllReaction(diaryId: number) {
    return this.reactionsRepository.findByDiary(diaryId);
  }

  async saveReaction(user: User, diaryId: number, reactionRequestDto: ReactionRequestDto) {
    const diary = await this.diariesService.findDiary(user, diaryId);

    const duplicateReaction = await this.reactionsRepository.findReactionByDiaryAndUser(
      user,
      diary,
    );
    if (duplicateReaction) {
      throw new BadRequestException('이미 해당 글에 리액션을 남겼습니다.');
    }

    await this.reactionsRepository.save({ user, diary, reaction: reactionRequestDto.reaction });
    await this.reactionsRepository.addDiaryEvent(diary.id);
  }

  async updateReaction(user: User, diaryId: number, reactionRequestDto: ReactionRequestDto) {
    const diary = await this.diariesService.findDiary(user, diaryId);
    const reaction = await this.reactionsRepository.findReactionByDiaryAndUser(user, diary);

    if (!reaction) {
      throw new BadRequestException('리액션 기록이 존재하지 않습니다.');
    }

    reaction.reaction = reactionRequestDto.reaction;
    await this.reactionsRepository.save(reaction);
    await this.reactionsRepository.addDiaryEvent(diary.id);
  }

  async deleteReaction(user: User, diaryId: number, reactionRequestDto: ReactionRequestDto) {
    const diary = await this.diariesService.findDiary(user, diaryId);
    const reaction = await this.reactionsRepository.findReactionByDiaryAndUserAndReaction(
      user,
      diary,
      reactionRequestDto.reaction,
    );

    if (!reaction) {
      throw new BadRequestException('이미 삭제된 리액션 정보입니다.');
    }

    await this.reactionsRepository.remove(reaction);
    await this.reactionsRepository.addDiaryEvent(diary.id);
  }
}
