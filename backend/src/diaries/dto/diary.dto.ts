import { IsInt, IsNotEmpty, IsOptional, Matches, Validate } from 'class-validator';
import { DiaryStatus } from '../entity/diaryStatus';
import { DiaryStatusValidator } from '../utils/diaryStatus.validator';
import { ApiProperty } from '@nestjs/swagger';
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

  @Validate(DiaryStatusValidator)
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

export class getFeedDiaryRequestDto {
  @ApiProperty({ description: '커서 방식 페이지네이션을 위한 diary Index' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  lastIndex: number;
}

export class FeedDiaryDto {
  @ApiProperty({ description: '일기 ID' })
  diaryId: number;

  @ApiProperty({ description: '작성자 ID' })
  authorId: number;

  @ApiProperty({ description: '작성일' })
  createdAt: Date;

  @ApiProperty({ description: '작성자 프로필 사진' })
  profileImage: string;

  @ApiProperty({ description: '작성자 닉네임' })
  nickname: string;

  @ApiProperty({ description: '일기 썸네일 사진' })
  thumbnail: string;

  @ApiProperty({ description: '일기 제목' })
  title: string;

  @ApiProperty({ description: '일기 태그 배열' })
  tags: string[];

  @ApiProperty({ description: '일기 3줄 요약' })
  summary: string;

  @ApiProperty({ description: '일기의 리액션 개수' })
  reactionCount: number;

  @ApiProperty({ description: '사용자 본인이 남긴 리액션(없으면 null)' })
  leavedReaction: string | null;
}

export class getFeedDiaryResponseDto {
  @ApiProperty({ description: '마지막으로 조회한 일기 id' })
  lastIndex: number;

  @ApiProperty({
    description: '친구 일기 배열',
    example: [
      {
        diaryId: 1,
        createdAt: '2023-11-25T13:56:02.027Z',
        profileImage: 'aldskf',
        nickname: 'cuhyun',
        thumbnail: null,
        title: '카페에서 공부한 날',
        summary: '카공은 즐거워',
        tags: ['카페'],
        reactionCount: 2,
        leavedReaction: '🥤',
      },
    ],
  })
  diaryList: FeedDiaryDto[];
}
