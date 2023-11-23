import { IsIn, IsNotEmpty, IsNumber, IsOptional, Matches, ValidateIf } from 'class-validator';
import { DiaryStatus } from '../entity/diaryStatus';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TimeUnit } from './timeUnit.enum';

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

  @ApiProperty({ description: '사용자의 기분(1 ~ 5 사이의 정수 값)' })
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

  @ApiProperty({ description: 'tag 이름', required: false })
  tagNames: string[];

  @IsOptional()
  @IsIn(Object.values(DiaryStatus))
  @ApiProperty({ description: '공개/비공개 여부', required: false })
  status: DiaryStatus;
}

export class GetAllEmotionsRequestDto {
  @IsOptional()
  @Matches(/^$|^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, {
    message: '유효하지 않은 날짜 형식입니다.',
  })
  @ApiProperty({ description: '시작 날짜', required: false, example: '2023-11-22' })
  startDate: string;

  @IsOptional()
  @Matches(/^$|^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, {
    message: '유효하지 않은 날짜 형식입니다.',
  })
  @ApiProperty({ description: '마지막 날짜', required: false, example: '2023-11-22' })
  lastDate: string;
}

export class GetAllEmotionsResponseDto {
  @ApiProperty({ description: '이모지' })
  emotion: string;

  @ApiProperty({
    description: '이모지가 같은 일기 정보 배열',
    example: [{ id: '1', title: '제목', createdAt: '2023-11-23T02:00:59.661Z' }],
  })
  diaryInfos: DiaryInfos[];
}

class DiaryInfos {
  id: number;
  title: string;
  createdAt: Date;
}

export class ReadUserDiariesRequestDto {
  @IsIn(Object.values(TimeUnit))
  type: TimeUnit;

  @ValidateIf((o) => o.type !== TimeUnit.Day)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '유효하지 않은 날짜 형식입니다.' })
  startDate: string;

  @ValidateIf((o) => o.type !== TimeUnit.Day)
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: '유효하지 않은 날짜 형식입니다.' })
  endDate: string;

  @ValidateIf((o) => o.type === TimeUnit.Day)
  @Type(() => Number)
  @IsNumber()
  lastIndex: number;
}

export class ReadUserDiariesResponseDto {
  @ApiProperty({ description: '일기 작성자 닉네임' })
  nickname: string;

  @ApiProperty({
    description: '일기 정보',
    example: [
      {
        diaryId: 1,
        thumbnail: 'imageURL',
        title: '제목',
        summary: '요약 정보',
        tags: ['태그1'],
        emotion: '😮‍💨',
        reactionCount: 1,
        createdAt: '2023-11-13T13:50:17.106Z',
      },
    ],
  })
  diaryList: AllDiaryInfosDto[];
}

export class AllDiaryInfosDto {
  diaryId: number;
  thumbnail: string;
  title: string;
  summary: string;
  tags: string[];
  emotion: string;
  reactionCount: number;
  createdAt: Date;
}
