import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entity/user.entity';
import { CreateUserDto, CreateUserResponseDto } from '../users/dto/user.dto';
import { Request } from 'express';
import { cookieExtractor } from './strategy/jwtAuth.strategy';
import { REFRESH_ACCESS_TOKEN_URL } from './utils/auth.constant';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
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

    this.authRepository.setRefreshToken(
      user.id,
      createUserDto.socialType,
      createUserDto.refreshToken,
    );

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
    const refreshTokenData = JSON.parse(await this.authRepository.getRefreshToken(payload.id));

    const newData = await fetch(REFRESH_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.makeNaverRefreshParams(refreshTokenData['refreshToken']),
    });

    const jsonData = await newData.json();

    return this.jwtService.sign({
      id: payload.id,
      nickname: payload.nickname,
      accessToken: jsonData['access_token'],
    });
  }

  private makeNaverRefreshParams(refreshToken: string): URLSearchParams {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', process.env.NAVER_CLIENT_ID);
    params.append('client_secret', process.env.NAVER_CLIENT_SECRET);
    params.append('refresh_token', refreshToken);

    return params;
  }
}
