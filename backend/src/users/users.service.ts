import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SearchUserResponseDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUserById(id: number) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new BadRequestException('유효하지 않은 사용자 정보입니다.');
    }
    return user;
  }

  async searchUsers(nickname: string): Promise<SearchUserResponseDto[]> {
    const users = await this.usersRepository.findByNickname(nickname);
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
    }));
  }
}
