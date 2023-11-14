import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { CreateUserResponseDto } from './dto/createUserResponseDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    let user = await this.userRepository.findBySocialIdAndSocialType(
      createUserDto.id,
      createUserDto.socialType,
    );

    if (!user) {
      user = await this.signUp(createUserDto);
    }

    return {
      userId: user.id,
      token: this.jwtService.sign({
        id: user.id,
        nickname: user.nickname,
        accessToken: createUserDto.accessToken,
      }),
    };
  }

  async signUp(user: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(user);
  }
}
