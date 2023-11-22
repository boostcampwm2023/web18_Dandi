import { IsNotEmpty, IsOptional, Matches, Validate } from 'class-validator';
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
  @Validate(DiaryStatusValidator)
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

  @Validate(DiaryStatusValidator)
  @ApiProperty({ description: '공개/비공개 여부', required: false })
  status: DiaryStatus;
}

export class GetAllEmotionsDto {
  @IsOptional()
  @Matches(/^$|^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, {
    message: '유효하지 않은 날짜 형식입니다.',
  })
  startDate: string;

  @IsOptional()
  @Matches(/^$|^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, {
    message: '유효하지 않은 날짜 형식입니다.',
  })
  lastDate: string;
}

export class GetAllEmotionsResponseDto {
  emotion: string;
  count: number;
}
