import { Injectable } from '@nestjs/common';
import { UserRepository } from './auth.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userReopsitory: UserRepository) {}
}
