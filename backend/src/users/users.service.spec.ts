import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ImagesService } from 'src/images/images.service';
import { User } from './entity/user.entity';
import { FriendStatus } from 'src/friends/entity/friendStatus';
import { BadRequestException } from '@nestjs/common';

jest.mock('./users.repository');
jest.mock('src/images/images.service');

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let imagesService: ImagesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository, ImagesService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    imagesService = module.get<ImagesService>(ImagesService);
  });

  describe('findUserInfo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('사용자 정보 조회', async () => {
      // given
      const userId = 1;
      const friendId = 2;
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const friend = { id: 2, email: 'test2', nickname: 'test2', profileImage: null } as User;
      const friendInfo = {
        id: 2,
        email: 'test2',
        nickname: 'test2',
        profileImage: null,
        diaries: [],
        sender: [],
        receiver: [
          {
            id: 1,
            status: 'complete',
            receiver: user,
            sender: friend,
          },
        ],
      };
      const friendInfoResult = {
        nickname: 'test2',
        profileImage: null,
        totalFriends: 1,
        isExistedTodayDiary: false,
        relation: {
          senderId: 2,
          receiverId: 1,
          status: FriendStatus.COMPLETE,
        },
      };

      (usersRepository.findUserInfoById as jest.Mock).mockResolvedValue(friendInfo);

      // when
      const result = await usersService.findUserInfo(userId, friendId);

      // then
      expect(result).toEqual(friendInfoResult);
      expect(usersRepository.findUserInfoById).toHaveBeenCalledTimes(1);
    });

    it('존재하지 않는 사용자의 정보 조회 시 예외 발생', async () => {
      // given
      const userId = 1;
      const friendId = 2;
      const friendInfo = null;

      (usersRepository.findUserInfoById as jest.Mock).mockResolvedValue(friendInfo);

      // when - then
      await expect(async () => await usersService.findUserInfo(userId, friendId)).rejects.toThrow(
        new BadRequestException('존재하지 않는 사용자 정보입니다.'),
      );
      expect(usersRepository.findUserInfoById).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserById', () => {});

  describe('updateUserProfile', () => {});

  describe('searchUsers', () => {});
});
