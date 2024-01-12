import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ImagesService } from 'src/images/images.service';
import { User } from './entity/user.entity';
import { FriendStatus } from 'src/friends/entity/friendStatus';
import { BadRequestException } from '@nestjs/common';
import { MoodDegree } from 'src/diaries/utils/diaries.constant';
import { DiaryStatus } from 'src/diaries/entity/diaryStatus';

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

    it('특정 사용자 정보 조회(작성한 일기 & 친구 관계가 있을 때)', async () => {
      // given
      const userId = 1;
      const friendId = 2;
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const friend = { id: 2, email: 'test2', nickname: 'test2', profileImage: null } as User;
      const friend2 = { id: 3, email: 'test3', nickname: 'test3', profileImage: null } as User;
      const diary = {
        id: 4,
        title: '주짓수 가는 날',
        content: '<p>오늘 드디어 체육관 등록하러 간다~</p>',
        summary: '오늘 드디어 체육관 등록하러 간다~',
        thumbnail: '',
        emotion: '🤩',
        mood: MoodDegree.SO_BAD,
        status: DiaryStatus.PUBLIC,
      };
      const friendInfo = {
        id: 2,
        email: 'test2',
        nickname: 'test2',
        profileImage: null,
        diaries: [diary],
        sender: [{ id: 2, status: FriendStatus.WAITING, receiver: friend, sender: friend2 }],
        receiver: [{ id: 1, status: FriendStatus.COMPLETE, receiver: user, sender: friend }],
      };
      const relation = { senderId: 2, receiverId: 1, status: FriendStatus.COMPLETE };

      (usersRepository.findUserInfoById as jest.Mock).mockResolvedValue(friendInfo);

      // when
      const result = await usersService.findUserInfo(userId, friendId);

      // then
      expect(result.nickname).toBe('test2');
      expect(result.profileImage).toBe(null);
      expect(result.totalFriends).toBe(1);
      expect(result.isExistedTodayDiary).toBeTruthy();
      expect(result.relation).toEqual(relation);
      expect(usersRepository.findUserInfoById).toHaveBeenCalledTimes(1);
    });

    it('특정 사용자 정보 조회(작성한 일기 & 친구 관계가 없을 때)', async () => {
      // given
      const userId = 1;
      const friendId = 2;
      const friendInfo = {
        id: 2,
        email: 'test2',
        nickname: 'test2',
        profileImage: null,
        diaries: [],
        sender: [],
        receiver: [],
      };

      (usersRepository.findUserInfoById as jest.Mock).mockResolvedValue(friendInfo);

      // when
      const result = await usersService.findUserInfo(userId, friendId);

      // then
      expect(result.nickname).toBe('test2');
      expect(result.profileImage).toBeNull();
      expect(result.totalFriends).toBe(0);
      expect(result.isExistedTodayDiary).toBeFalsy();
      expect(result.relation).toBeNull();
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

  describe('findUserById', () => {
    beforeEach(() => jest.clearAllMocks());

    it('user id로 사용자 조회', async () => {
      // given
      const userId = 1;
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null };

      (usersRepository.findById as jest.Mock).mockResolvedValue(user);

      // when
      const result = await usersService.findUserById(userId);

      // then
      expect(result).toBe(user);
      expect(usersRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('user id가 존재하지 않는 경우 예외 발생', async () => {
      // given
      const userId = 1;
      (usersRepository.findById as jest.Mock).mockResolvedValue(null);

      // when - then
      await expect(async () => await usersService.findUserById(userId)).rejects.toThrow(
        new BadRequestException('존재하지 않는 사용자 정보입니다.'),
      );
      expect(usersRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUserProfile', () => {
    beforeEach(() => jest.clearAllMocks());

    it('사용자 닉네임, 프로필 이미지 수정', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const requestDto = { nickname: 'test2' };
      const file = {
        fieldname: 'profileImage',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from(
          'ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 07 05 05 06 05 04 07 06 06 06 08 07 07 08 0b 12 0b 0b 0a 0a 0b 16 0f 10 0d ... 22876 more bytes',
        ),
        size: 22926,
      } as Express.Multer.File;

      (imagesService.uploadProfileImage as jest.Mock).mockResolvedValue(
        'https://dandi-object-storage.kr.object.ncloudstorage.com/3/profile/prifile.jpeg',
      );

      // when
      await usersService.updateUserProfile(user, requestDto, file);

      // then
      expect(imagesService.uploadProfileImage).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
    });

    it('사용자 프로필 이미지만 수정', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const requestDto = { nickname: undefined };
      const file = {
        fieldname: 'profileImage',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from(
          'ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 07 05 05 06 05 04 07 06 06 06 08 07 07 08 0b 12 0b 0b 0a 0a 0b 16 0f 10 0d ... 22876 more bytes',
        ),
        size: 22926,
      } as Express.Multer.File;

      (imagesService.uploadProfileImage as jest.Mock).mockResolvedValue(
        'https://dandi-object-storage.kr.object.ncloudstorage.com/3/profile/prifile.jpeg',
      );

      // when
      await usersService.updateUserProfile(user, requestDto, file);

      // then
      expect(imagesService.uploadProfileImage).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
    });

    it('사용자 닉네임만 수정', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const requestDto = { nickname: 'test2' };
      const file = undefined;

      // when
      await usersService.updateUserProfile(user, requestDto, file);

      // then
      expect(imagesService.uploadProfileImage).toHaveBeenCalledTimes(0);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
    });

    it('수정된 정보가 없는 경우 예외 발생', async () => {
      // given
      const user = { id: 1, email: 'test1', nickname: 'test1', profileImage: null } as User;
      const requestDto = { nickname: undefined };
      const file = undefined;

      // when - then
      await expect(
        async () => await usersService.updateUserProfile(user, requestDto, file),
      ).rejects.toThrow(new BadRequestException('수정될 정보가 존재하지 않습니다.'));

      expect(imagesService.uploadProfileImage).toHaveBeenCalledTimes(0);
      expect(usersRepository.save).toHaveBeenCalledTimes(0);
    });
  });

  describe('searchUsers', () => {
    beforeEach(() => jest.clearAllMocks());

    it('닉네임으로 사용자 검색', async () => {
      // given
      const nickname = 'test';
      const users = [
        {
          id: 1,
          email: 'test1',
          nickname: 'test1',
          socialId: '8JRte7e8uadfegs',
          socialType: 'naver',
          profileImage: null,
        },
        {
          id: 2,
          email: 'test2',
          nickname: 'test2',
          socialId: 'adsfa8JRte7e8u',
          socialType: 'naver',
          profileImage: null,
        },
      ];
      const searchResult = [
        { id: 1, email: 'test1', nickname: 'test1', profileImage: null },
        { id: 2, email: 'test2', nickname: 'test2', profileImage: null },
      ];

      (usersRepository.findByNickname as jest.Mock).mockResolvedValue(users);

      // when
      const result = await usersService.searchUsers(nickname);

      // then
      expect(result).toEqual(searchResult);
      expect(result).toHaveLength(2);
      expect(usersRepository.findByNickname).toHaveBeenCalledTimes(1);
    });

    it('검색 닉네임과 일치하는 사용자 없는 경우 빈 배열 반환', async () => {
      // given
      const nickname = '테스트';
      (usersRepository.findByNickname as jest.Mock).mockResolvedValue([]);

      // when
      const result = await usersService.searchUsers(nickname);

      // then
      expect(result).toEqual([]);
      expect(usersRepository.findByNickname).toHaveBeenCalledTimes(1);
    });
  });
});
