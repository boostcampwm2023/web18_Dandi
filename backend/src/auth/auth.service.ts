import { Injectable } from '@nestjs/common';
import { UserRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { CreateUserDto, CreateUserResponseDto } from './dto/user.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async login(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    let user = await this.userRepository.findBySocialIdAndSocialType(
      createUserDto.id,
      createUserDto.socialType,
    );

    if (!user) {
      user = await this.signUp(createUserDto);
    }

    // refresh token 만료기간 2주로 설정
    const dataForRefresh = {socialType: createUserDto.socialType, refreshToken: createUserDto.refreshToken};
    this.redis.set(`${user.id}`, JSON.stringify(dataForRefresh), 'EX', 60*60*24*14);

    return {
      userId: user.id,
      token: this.jwtService.sign(
        {
          id: user.id,
          nickname: user.nickname,
          accessToken: createUserDto.accessToken,
        },
        // jwt 만료기간 30분으로 설정
        { expiresIn: `${60*30*1000}` }
      ),
    };
  }

  async signUp(user: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(user);
  }
}
