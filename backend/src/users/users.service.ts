import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  GetUserResponseDto,
  SearchUserResponseDto,
  UpdateUserProfileRequestDto,
} from './dto/user.dto';
import { User } from './entity/user.entity';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private imagesService: ImagesService,
  ) {}

  async findUserInfo(userId: number, friendId: number): Promise<GetUserResponseDto> {
    const user = await this.usersRepository.findUserInfoById(friendId);

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자 정보입니다.');
    }

    const totalFriends = user.sender.length + user.receiver.length;
    const relation = [...user.sender, ...user.receiver].find((relation) => {
      return (
        (relation.receiver.id === userId && relation.sender.id === friendId) ||
        (relation.receiver.id === friendId && relation.sender.id === friendId)
      );
    });

    return {
      nickname: user.nickname,
      profileImage: user.profileImage,
      totalFriends: totalFriends,
      isExistedTodayDiary: user.diaries ? true : false,
      relation: relation
        ? {
            senderId: relation.sender.id,
            receiverId: relation.receiver.id,
            status: relation.status,
          }
        : null,
    };
  }

  async findUserById(userId: number) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자 정보입니다.');
    }
    return user;
  }

  async updateUserProfile(
    user: User,
    requestDto: UpdateUserProfileRequestDto,
    file: Express.Multer.File,
  ) {
    if (!file && !requestDto.nickname) {
      throw new BadRequestException('수정될 정보가 존재하지 않습니다.');
    }
    if (file) {
      user.profileImage = (await this.imagesService.uploadProfileImage(user.id, file)).Location;
    }
    user.nickname = requestDto.nickname ? requestDto.nickname : user.nickname;

    await this.usersRepository.save(user);
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
