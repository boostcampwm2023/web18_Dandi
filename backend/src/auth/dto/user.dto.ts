import { SocialType } from '../entity/socialType';

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
  userId: number;
  token: string;
}
