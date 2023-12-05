import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FriendStatus } from 'src/friends/entity/friendStatus';

class RelationDto {
  senderId: number;
  receiverId: number;
  status: FriendStatus;
}

export class GetUserResponseDto {
  @ApiProperty({ description: '사용자 닉네임' })
  nickname: string;

  @ApiProperty({ description: '사용자 프로필 이미지' })
  profileImage: string;

  @ApiProperty({ description: '사용자의 친구 수 ' })
  totalFriends: number;

  @ApiProperty({ description: '오늘 일기 작성 여부' })
  isExistedTodayDiary: boolean;

  @ApiProperty({ description: '해당 사용자와 친구인지 여부' })
  relation: RelationDto;
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

export class UpdateUserProfileRequestDto {
  @ApiProperty({ description: '사용자 닉네임' })
  @IsOptional()
  nickname: string;
}
