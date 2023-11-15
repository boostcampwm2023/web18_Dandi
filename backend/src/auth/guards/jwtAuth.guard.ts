import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT } from '../utils/jwt.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT) {}
