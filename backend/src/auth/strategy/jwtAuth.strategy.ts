import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import 'dotenv/config';
import { VerifyCallback } from '../utils/verifyCallback';
import { UserRepository } from '../auth.repository';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any, done: VerifyCallback) {
    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      return done(new Error('인증 실패'), null);
    }
    return done(null, user);
  }
}
