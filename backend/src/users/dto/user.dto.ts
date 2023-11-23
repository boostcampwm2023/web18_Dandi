import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponseDto {
  @ApiProperty({ description: '사용자 닉네임' })
  nickname: string;

  @ApiProperty({ description: '사용자 프로필 이미지' })
  profileImage: string;

  @ApiProperty({ description: '사용자의 친구 수 ' })
  totalFriends: number;

  @ApiProperty({ description: '오늘 일기 작성 여부' })
  isExistedTodayDiary: boolean;
}

export class SearchUserResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: number;

  @ApiProperty({ description: '사용자 이메일' })
  email: string;

  @ApiProperty({ description: '사용자 닉네임' })
  nickname: string;

  @ApiProperty({ description: '사용자 프로필 이미지' })
  profileImage: string;
}
