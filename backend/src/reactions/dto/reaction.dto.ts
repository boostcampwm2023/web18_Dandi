import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReactionRequestDto {
  @IsNotEmpty()
  @ApiProperty({ description: '리액션 이모지' })
  reaction: string;
}

export class ReactionInfoResponseDto {
  userId: number;
  nickname: string;
  profileImage: string;
  reaction: string;
}
