import { Profile, Strategy } from 'passport-naver-v2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SocialType } from '../entity/socialType';
import 'dotenv/config';
import { CreateUserDto } from '../dto/createUserDto';
import { VerifyCallback } from '../utils/verifyCallback';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALLBACK_URL,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const { id, email, nickname, profileImage } = profile;
    const user: CreateUserDto = {
      id,
      email,
      nickname,
      profileImage,
      accessToken,
      refreshToken,
      socialType: SocialType.NAVER,
    };

    return done(null, user);
  }
}
