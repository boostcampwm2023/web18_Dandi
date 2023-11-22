import { ApiProperty } from '@nestjs/swagger';
import { SocialType } from 'src/users/entity/socialType';

export class AuthUserDto {
  id: string;
  email: string;
  nickname: string;
  profile_image: string;
}

export class OAuthLoginDto {
  code: string;
  state: string;
  socialType: SocialType;
}

export class LoginResultDto {
  userId: number;
  token: string;
}

export class OAuthLoginResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: number;
}
