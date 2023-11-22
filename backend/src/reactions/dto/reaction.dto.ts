import { IsNotEmpty } from 'class-validator';

export class CreateReactionDto {
  @IsNotEmpty()
  reaction: string;
}

export class GetReactionResponseDto {
  reactionList: ReactionInfoResponseDto[];
}

export class ReactionInfoResponseDto {
  userId: number;
  nickname: string;
  profileImage: string;
  reaction: string;
}
