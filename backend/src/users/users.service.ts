import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SearchUserResponseDto } from './dto/user.dto';
import { isToday } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findUserInfo(userId: number) {
    const user = await this.usersRepository.findUserInfoById(userId);

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자 정보입니다.');
    }
    const sender = await user.sender;
    const receiver = await user.receiver;
    const diaries = await user.diaries;

    const totalFriends = sender.length + receiver.length;
    const isExistedTodayDiary = diaries.length !== 0 && isToday(diaries[0].createdAt);
    return { user, totalFriends, isExistedTodayDiary };
  }

  async findUserById(userId: number) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자 정보입니다.');
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
