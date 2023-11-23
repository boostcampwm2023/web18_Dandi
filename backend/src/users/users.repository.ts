import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { AuthUserDto } from '../auth/dto/auth.dto';
import { SocialType } from './entity/socialType';
import { FriendStatus } from 'src/friends/entity/friendStatus';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserInfoById(userId: number) {
    const user = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.diaries', 'diary')
      .leftJoinAndSelect('user.sender', 'sender', 'sender.status = :status', {
        status: FriendStatus.COMPLETE,
      })
      .leftJoinAndSelect('user.receiver', 'receiver', 'receiver.status = :status', {
        status: FriendStatus.COMPLETE,
      })
      .where('user.id = :userId', { userId })
      .orderBy('diary.createdAt', 'DESC')
      .getOne();

    return user;
  }

  async findById(id: number): Promise<User> {
    return await this.createQueryBuilder('user').where('user.id = :id', { id }).getOne();
  }

  async findBySocialIdAndSocialType(socialId: string, socialType: string): Promise<User> {
    return await this.createQueryBuilder('user')
      .where('user.socialId = :socialId', { socialId })
      .andWhere('user.socialType = :socialType', { socialType })
      .getOne();
  }

  async createUser(authUserDto: AuthUserDto, socialType: SocialType): Promise<User> {
    const { id, email, nickname, profile_image } = authUserDto;

    return this.save({ socialId: id, email, nickname, socialType, profileImage: profile_image });
  }

  async findByNickname(nickname: string): Promise<User[]> {
    return await this.createQueryBuilder('user')
      .where('user.nickname LIKE :nickname', { nickname: `%${nickname}%` })
      .getMany();
  }
}
