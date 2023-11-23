import { SocialType } from '../../users/entity/socialType';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  id: string;
  email: string;
  nickname: string;
  socialType: SocialType;
  profileImage: string;
  accessToken: string;
  refreshToken: string;
}

export class AuthUserResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  userId: number;

  @ApiProperty({ description: 'jwt 토큰' })
  token: string;
}
