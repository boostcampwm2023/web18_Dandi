import { SocialType } from '../entity/socialType';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  id: string;
  email: string;
  nickname: string;
  socialType: SocialType;
  profileImage: string;
  accessToken: string;
  refreshToken: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  userId: number;

  @ApiProperty({ description: 'jwt 토큰' })
  token: string;
}
