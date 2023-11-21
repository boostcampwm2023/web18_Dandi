import { IsIn, IsNotEmpty, IsNumber, Matches, Min, ValidateIf } from 'class-validator';
import { DiaryStatus } from '../entity/diaryStatus';
import { ApiProperty } from '@nestjs/swagger';
import { TimeUnit } from './timeUnit.enum';
import { Type } from 'class-transformer';

export class CreateDiaryDto {
  @IsNotEmpty()
  @ApiProperty({ description: '일기 제목' })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ description: '일기 내용' })
  content: string;

  @ApiProperty({ description: '섬네일 이미지의 S3 주소', required: false })
  thumbnail: string;

  @IsNotEmpty()
  @ApiProperty({ description: '감정(이모지)' })
  emotion: string;

  @IsNotEmpty()
  @ApiProperty({ description: '사용자의 기분(a ~ b 사이의 실수 값)' })
  mood: number;

  @ApiProperty({ description: 'tag 이름', required: false })
  tagNames: string[];

  @IsNotEmpty()
  @IsIn(Object.values(DiaryStatus))
  @ApiProperty({ description: '공개/비공개 여부' })
  status: DiaryStatus;
}

export class GetDiaryResponseDto {
  @ApiProperty({ description: '작성자 ID' })
  userId: number;

  @ApiProperty({ description: '작성자 닉네임' })
  authorName: string;

  @ApiProperty({ description: '일기 제목' })
  title: string;

  @ApiProperty({ description: '일기 내용' })
  content: string;

  @ApiProperty({ description: '일기 썸네일' })
  thumbnail: string;

  @ApiProperty({ description: '감정(이모지)' })
  emotion: string;

  @ApiProperty({ description: '사용자의 기분(a ~ b 사이의 실수 값)' })
  mood: number;

  @ApiProperty({ description: '일기 태그 배열' })
  tags: string[];

  @ApiProperty({ description: '해당 글의 리액션 갯수' })
  reactionCount: number;
}

export class UpdateDiaryDto {
  @ApiProperty({ description: '일기 제목', required: false })
  title: string;

  @ApiProperty({ description: '일기 내용', required: false })
  content: string;

  @ApiProperty({ description: '섬네일 이미지의 S3 주소', required: false })
  thumbnail: string;

  @ApiProperty({ description: '감정(이모지)', required: false })
  emotion: string;

  @ApiProperty({ description: '사용자의 기분(a ~ b 사이의 실수 값)', required: false })
  mood: number;

  @ApiProperty({ description: 'tag 이름', required: false })
  tagNames: string[];

  @ApiProperty({ description: '공개/비공개 여부', required: false })
  @IsIn(Object.values(DiaryStatus))
  status: DiaryStatus;
}

export class ReadUserDiariesDto {
  @IsIn(Object.values(TimeUnit))
  type: TimeUnit;

  @ValidateIf((o) => o.type !== TimeUnit.DAY)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '유효하지 않은 날짜 형식입니다.' })
  startDate: Date;

  @ValidateIf((o) => o.type !== TimeUnit.DAY)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '유효하지 않은 날짜 형식입니다.' })
  endDate: Date;

  @ValidateIf((o) => o.type === TimeUnit.DAY)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page: number;
}

export class ReadUserDiariesResponseDto {}
