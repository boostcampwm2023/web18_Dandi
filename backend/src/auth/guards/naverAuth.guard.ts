import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SocialType } from '../entity/socialType';

@Injectable()
export class NaverAuthGuard extends AuthGuard(SocialType.NAVER) {}
