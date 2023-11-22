import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { AuthUserDto } from '../auth/dto/auth.dto';
import { SocialType } from './entity/socialType';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
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
