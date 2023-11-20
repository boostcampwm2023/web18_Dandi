import { IsNotEmpty, Validate } from 'class-validator';
import { DiaryStatus } from '../entity/diaryStatus';
import { DiaryStatusValidator } from '../utils/diaryStatus.validator';

export class CreateDiaryDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  thumbnail: string;

  @IsNotEmpty()
  emotion: string;

  @IsNotEmpty()
  mood: number;

  tagNames: string[];

  @IsNotEmpty()
  @Validate(DiaryStatusValidator)
  status: DiaryStatus;
}
