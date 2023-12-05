import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { AuthUserDto } from '../auth/dto/auth.dto';
import { SocialType } from './entity/socialType';
import { FriendStatus } from 'src/friends/entity/friendStatus';
import { endOfDay, startOfDay } from 'date-fns';
import { GetUserResponseDto } from './dto/user.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserInfoById(userId: number): Promise<GetUserResponseDto> {
    const today = new Date();
    const user = await this.createQueryBuilder('user')
      .select([
        'user.nickname as nickname',
        'user.profileImage as profileImage',
        'COUNT(DISTINCT sender.id) + COUNT(DISTINCT receiver.id) as totalFriends',
        '(CASE WHEN COUNT(diary.id) > 0 THEN true ELSE false END) as isExistedTodayDiary',
      ])
      .leftJoin(
        'user.diaries',
        'diary',
        'diary.createdAt >= :startOfDay AND diary.createdAt <= :endOfDay',
        { startOfDay: startOfDay(today), endOfDay: endOfDay(today) },
      )
      .leftJoin('user.sender', 'sender', 'sender.status = :status', {
        status: FriendStatus.COMPLETE,
      })
      .leftJoin('user.receiver', 'receiver', 'receiver.status = :status', {
        status: FriendStatus.COMPLETE,
      })
      .where('user.id = :userId', { userId })
      .getRawOne();

    user.totalFriends = Number(user.totalFriends);
    user.isExistedTodayDiary = user.isExistedTodayDiary === '1';
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
