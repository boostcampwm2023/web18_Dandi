import { IsNotEmpty } from 'class-validator';

export class CreateReactionDto {
  @IsNotEmpty()
  reaction: string;
}
