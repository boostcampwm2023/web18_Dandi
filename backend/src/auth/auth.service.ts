import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(user: CreateUserDto) {
    const duplicateUser = await this.userRepository.findBySocialIdAndSocialType(
      user.id,
      user.socialType,
    );
    if (!duplicateUser) {
      await this.userRepository.createUser(user);
    }

    //TODO: JWT 토큰 반환
  }
}
