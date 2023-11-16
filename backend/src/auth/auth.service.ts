import { Injectable } from '@nestjs/common';
import { UserRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { CreateUserDto, CreateUserResponseDto } from './dto/user.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Request } from 'express';
import { cookieExtractor } from './strategy/jwtAuth.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    @InjectRedis() private readonly redis: Redis,
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
    const dataForRefresh = {
      socialType: createUserDto.socialType,
      refreshToken: createUserDto.refreshToken,
    };
    this.redis.set(`${user.id}`, JSON.stringify(dataForRefresh), 'EX', 60 * 60 * 24 * 14);
    console.log(createUserDto.refreshToken);
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

  async refreshAccessToken(req: Request) {
    const userJwt = cookieExtractor(req);
    const payload = this.jwtService.decode(userJwt);
    const refreshTokenData = JSON.parse(await this.redis.get(payload.id));
    const url = 'https://nid.naver.com/oauth2.0/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', process.env.NAVER_CLIENT_ID);
    params.append('client_secret', process.env.NAVER_CLIENT_SECRET);
    params.append('refresh_token', refreshTokenData['refreshToken']);

    const newData = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const jsonData = await newData.json();

    return this.jwtService.sign({
      id: payload.id,
      nickname: payload.nickname,
      accessToken: jsonData['access_token'],
    });
  }
}
