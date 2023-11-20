import { IsNotEmpty, Validate } from 'class-validator';
import { DiaryStatus } from '../entity/diaryStatus';
import { DiaryStatusValidator } from '../utils/diaryStatus.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryDto {
  @IsNotEmpty()
  @ApiProperty({ description: '일기 제목' })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ description: '일기 내용' })
  content: string;

  @ApiProperty({ description: '섬네일 이미지의 S3 주소' })
  thumbnail: string;

  @IsNotEmpty()
  @ApiProperty({ description: '감정(이모지)' })
  emotion: string;

  @IsNotEmpty()
  @ApiProperty({ description: '사용자의 기분(a ~ b 사이의 실수 값)' })
  mood: number;

  @ApiProperty({ description: 'tag 이름' })
  tagNames: string[];

  @IsNotEmpty()
  @Validate(DiaryStatusValidator)
  @ApiProperty({ description: '공개/비공개 여부' })
  status: DiaryStatus;
}
