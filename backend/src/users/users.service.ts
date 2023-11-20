import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SearchUserResponseDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async searchUsers(nickname: string): Promise<SearchUserResponseDto[]> {
    return await this.usersRepository.searchUsers(nickname);
  }
}
