import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UsersRepository } from 'src/users/users.repository';
import { GET_NAVER_PROFILE_URL, NAVER_OAUTH_URL } from './utils/auth.constant';
import { SocialType } from 'src/users/entity/socialType';
import { OAuthLoginDto } from './dto/auth.dto';
import {
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

jest.mock('@nestjs/jwt');
jest.mock('./auth.repository');
jest.mock('../users/users.repository');

describe('FriendsService Test', () => {
  let jwtService: JwtService;
  let authService: AuthService;
  let authRepository: AuthRepository;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService, AuthService, AuthRepository, UsersRepository],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('login 테스트', () => {
    const mockDto: OAuthLoginDto = {
      code: 'testCode',
      state: 'testState',
      socialType: SocialType.NAVER,
    };

    const profile = {
      id: '1',
      email: 'test@test.com',
      nickname: 'testNickname',
      profile_image: 'testImage',
    };
    const mockUser = {
      id: 1,
      nickname: 'testNickname',
    };
    const tokenResponse = {
      status: 200,
      json: function () {
        return { access_token: 'mocked_token' };
      },
    };
    const profileResponse = {
      status: 200,
      json: function () {
        return { response: profile };
      },
    };

    beforeEach(() => jest.clearAllMocks());

    it('DB에 존재하지 않는 사용자 로그인 요청 시 회원가입 후 결과 반환', async () => {
      //given
      tokenResponse.status = 200;
      profileResponse.status = 200;

      (usersRepository.findBySocialIdAndSocialType as jest.Mock).mockResolvedValue(null);
      (usersRepository.createUser as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockResolvedValue('mocked_token');
      global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url === NAVER_OAUTH_URL) {
          return tokenResponse;
        }
        if (url === GET_NAVER_PROFILE_URL) {
          return profileResponse;
        }
      });

      //when
      const result = await authService.login(mockDto);

      //then
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(usersRepository.findBySocialIdAndSocialType).toHaveBeenCalledTimes(1);
      expect(usersRepository.createUser).toHaveBeenCalledTimes(1);
      expect(authRepository.setRefreshToken).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ token: 'mocked_token', userId: 1 });
    });

    it('DB에 존재하는 사용자 로그인 요청 시 회원가입 진행 x', async () => {
      //given
      tokenResponse.status = 200;
      profileResponse.status = 200;

      (usersRepository.findBySocialIdAndSocialType as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockResolvedValue('mocked_token');
      global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url === NAVER_OAUTH_URL) {
          return tokenResponse;
        }
        if (url === GET_NAVER_PROFILE_URL) {
          return profileResponse;
        }
      });

      //when
      const result = await authService.login(mockDto);

      //then
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(usersRepository.findBySocialIdAndSocialType).toHaveBeenCalledTimes(1);
      expect(usersRepository.createUser).toHaveBeenCalledTimes(0);
      expect(authRepository.setRefreshToken).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ token: 'mocked_token', userId: 1 });
    });

    it('유효하지 않은 토큰 응답 시 예외 발생', async () => {
      //given
      tokenResponse.status = 401;

      global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url === NAVER_OAUTH_URL) {
          return tokenResponse;
        }
      });

      //when
      await expect(async () => await authService.login(mockDto)).rejects.toThrow(
        new UnauthorizedException('유효하지 않은 인가 코드입니다.'),
      );
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('유효하지 않은 access 토큰으로 프로필 요청 시 예외 발생', async () => {
      //given
      tokenResponse.status = 200;
      profileResponse.status = 401;

      global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url === NAVER_OAUTH_URL) {
          return tokenResponse;
        }
        if (url === GET_NAVER_PROFILE_URL) {
          return profileResponse;
        }
      });

      //when
      await expect(async () => await authService.login(mockDto)).rejects.toThrow(
        new UnauthorizedException('유효하지 않은 accessToken입니다.'),
      );
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(usersRepository.findBySocialIdAndSocialType).toHaveBeenCalledTimes(0);
    });

    it('호출 권한이 존재하지 않는 프로필 요청 시 예외 발생', async () => {
      //given
      tokenResponse.status = 200;
      profileResponse.status = 403;

      global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url === NAVER_OAUTH_URL) {
          return tokenResponse;
        }
        if (url === GET_NAVER_PROFILE_URL) {
          return profileResponse;
        }
      });

      //when
      await expect(async () => await authService.login(mockDto)).rejects.toThrow(
        new ForbiddenException('데이터 호출 권한이 없습니다.'),
      );
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(usersRepository.findBySocialIdAndSocialType).toHaveBeenCalledTimes(0);
    });

    it('프로필 요청 시 정상 응답 외 응답 시 예외 발생', async () => {
      //given
      tokenResponse.status = 200;
      profileResponse.status = 404;

      global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url === NAVER_OAUTH_URL) {
          return tokenResponse;
        }
        if (url === GET_NAVER_PROFILE_URL) {
          return profileResponse;
        }
      });

      //when
      await expect(async () => await authService.login(mockDto)).rejects.toThrow(
        new InternalServerErrorException('Naver 서버 에러입니다.'),
      );
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(usersRepository.findBySocialIdAndSocialType).toHaveBeenCalledTimes(0);
    });
  });

  describe('refreshAccessToken 테스트', () => {
    const mockReq: any = {
      cookies: { utk: 'mock_token' },
    };
    const mockPayload = {
      id: 1,
      nickname: 'testNickname',
      accessKey: 'testKey',
    };

    beforeEach(() => jest.clearAllMocks());

    it('저장소에 리프레시 토큰이 존재하면 새 access token 발급', async () => {
      //given
      (jwtService.decode as jest.Mock).mockResolvedValue(mockPayload);
      (authRepository.getRefreshToken as jest.Mock).mockResolvedValue('mock_token');

      //when
      const result = await authService.refreshAccessToken(mockReq);

      //then
      expect(jwtService.decode).toHaveBeenCalledTimes(1);
      expect(authRepository.getRefreshToken).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('저장소에 리프레시 토큰이 존재하지 않으면 예외 발생', async () => {
      //given
      (jwtService.decode as jest.Mock).mockResolvedValue(mockPayload);
      (authRepository.getRefreshToken as jest.Mock).mockResolvedValue(null);

      //when-then
      await expect(async () => await authService.refreshAccessToken(mockReq)).rejects.toThrow(
        new UnauthorizedException('로그인이 필요합니다.'),
      );
      expect(jwtService.decode).toHaveBeenCalledTimes(1);
      expect(authRepository.getRefreshToken).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledTimes(0);
    });
  });
});
