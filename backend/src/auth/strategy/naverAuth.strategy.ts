import { Profile, Strategy } from 'passport-naver-v2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SocialType } from '../entity/socialType';

require('dotenv').config();

type VerifyCallback = (error: Error, user?: any, info?: any) => void;

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy) {
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
    const { id, email, nickname } = profile;
    const user = {
      id,
      email,
      nickname,
      socialType: SocialType.NAVER,
    };

    return done(null, user);
  }
}
