import { IsNotEmpty } from 'class-validator';

export class CreateReactionDto {
  @IsNotEmpty()
  reaction: string;
}

export class GetReactionResponseDto {
  reactionList: ReactionInfo[];
}

export class ReactionInfo {
  userId: number;
  nickname: string;
  profileImage: string;
  reaction: string;
}
