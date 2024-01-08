import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from 'src/friends/friends.service';
import { FriendsRepository } from 'src/friends/friends.repository';
import { UsersRepository } from 'src/users/users.repository';
import * as dataSource from 'typeorm';
import { FriendStatus } from 'src/friends/entity/friendStatus';

jest.mock('src/friends/friends.repository');
jest.mock('src/users/users.repository');

describe('친구 요청 테스트', () => {
  let friendsService: FriendsService;
  let friendsRepository: FriendsRepository;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        FriendsRepository,
        UsersRepository,
        { provide: dataSource.DataSource, useValue: {} },
      ],
    }).compile();

    friendsService = module.get<FriendsService>(FriendsService);
    friendsRepository = module.get<FriendsRepository>(FriendsRepository);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  beforeEach(() => jest.clearAllMocks());

  it('요청ID와 수신ID가 일치하면 예외 발생', () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 1 };

    //when - then
    expect(() => friendsService.requestFriend(friendsRelationDto)).rejects.toThrow(
      new BadRequestException('나에게 친구신청 보낼 수 없습니다.'),
    );
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(0);
  });

  it('친구 신청 기록이 존재하면 예외 발생', async () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 2 };
    const mockFriends = {
      id: 1,
      status: FriendStatus.WAITING,
      sender: { id: 1 },
      receiver: { id: 2 },
    };
    (friendsRepository.findFriendRequest as jest.Mock).mockResolvedValue(mockFriends);

    //when - then
    await expect(
      async () => await friendsService.requestFriend(friendsRelationDto),
    ).rejects.toThrow(new BadRequestException('이미 친구신청을 하셨습니다.'));
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(1);
  });

  it('친구 신청 수신 기록이 존재하면 예외 발생', async () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 2 };
    const mockFriends = {
      id: 1,
      status: FriendStatus.WAITING,
      sender: { id: 2 },
      receiver: { id: 1 },
    };
    (friendsRepository.findFriendRequest as jest.Mock).mockImplementation(
      (senderId: number, receiverId: number) => {
        if (senderId === 2) {
          return mockFriends;
        }
        return null;
      },
    );

    //when - then
    await expect(
      async () => await friendsService.requestFriend(friendsRelationDto),
    ).rejects.toThrow(new BadRequestException('상대의 친구신청을 확인해주세요.'));
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(2);
    expect(usersRepository.findById).toHaveBeenCalledTimes(0);
  });

  it('친구 신청 기록이 존재하지 않으면 친구 기록 생성', async () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 2 };
    (friendsRepository.findFriendRequest as jest.Mock).mockReturnValue(null);

    //when
    await friendsService.requestFriend(friendsRelationDto);

    //then
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(2);
    expect(usersRepository.findById).toHaveBeenCalledTimes(2);
    expect(friendsRepository.createFriend).toHaveBeenCalledTimes(1);
  });
});

describe('친구 신청 취소 테스트', () => {
  let friendsService: FriendsService;
  let friendsRepository: FriendsRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        FriendsRepository,
        UsersRepository,
        { provide: dataSource.DataSource, useValue: {} },
      ],
    }).compile();

    friendsService = module.get<FriendsService>(FriendsService);
    friendsRepository = module.get<FriendsRepository>(FriendsRepository);
  });

  beforeEach(() => jest.clearAllMocks());

  it('요청ID와 수신ID가 일치하면 예외 발생', () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 1 };

    //when - then
    expect(() => friendsService.cancelFriendRequest(friendsRelationDto)).rejects.toThrow(
      new BadRequestException('나와는 친구신청 관리를 할 수 없습니다.'),
    );
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(0);
  });

  it('수신한 친구 요청이 존재하면 예외 발생', async () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 2 };
    const mockFriends = {
      id: 1,
      status: FriendStatus.WAITING,
      sender: { id: 2 },
      receiver: { id: 1 },
    };
    (friendsRepository.findFriendRequest as jest.Mock).mockImplementation(
      (senderId: number, receiverId: number) => {
        if (senderId === 2) {
          return mockFriends;
        }
        return null;
      },
    );

    //when - then
    await expect(
      async () => await friendsService.cancelFriendRequest(friendsRelationDto),
    ).rejects.toThrow(new BadRequestException('상대의 친구신청을 확인하세요.'));
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(2);
  });

  it('수신한 친구 요청이 존재하면서, 이미 친구라면 예외 발생', async () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 2 };
    const mockFriends = {
      id: 1,
      status: FriendStatus.COMPLETE,
      sender: { id: 2 },
      receiver: { id: 1 },
    };
    (friendsRepository.findFriendRequest as jest.Mock).mockImplementation(
      (senderId: number, receiverId: number) => {
        if (senderId === 2) {
          return mockFriends;
        }
        return null;
      },
    );

    //when - then
    await expect(
      async () => await friendsService.cancelFriendRequest(friendsRelationDto),
    ).rejects.toThrow(new BadRequestException('이미 친구입니다.'));
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(2);
  });

  it('친구 신청 기록이 존재하지 않으면 예외 발생', async () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 2 };
    (friendsRepository.findFriendRequest as jest.Mock).mockReturnValue(null);

    //when - then
    await expect(
      async () => await friendsService.cancelFriendRequest(friendsRelationDto),
    ).rejects.toThrow(new BadRequestException('해당 사용자 사이의 친구신청 기록이 없습니다.'));
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(2);
  });

  it('송신한 친구 요청이 존재하지만, 이미 친구 관계라면 예외 발생', async () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 2 };
    const mockFriends = {
      id: 1,
      status: FriendStatus.COMPLETE,
      sender: { id: 1 },
      receiver: { id: 2 },
    };
    (friendsRepository.findFriendRequest as jest.Mock).mockResolvedValue(mockFriends);

    //when - then
    await expect(
      async () => await friendsService.cancelFriendRequest(friendsRelationDto),
    ).rejects.toThrow(new BadRequestException('이미 친구입니다.'));
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(1);
  });

  it('송신한 친구 신청 기록이 존재하면 기록 삭제', async () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 2 };
    const mockFriends = {
      id: 1,
      status: FriendStatus.WAITING,
      sender: { id: 2 },
      receiver: { id: 1 },
    };
    (friendsRepository.findFriendRequest as jest.Mock).mockReturnValue(mockFriends);

    //when
    await friendsService.cancelFriendRequest(friendsRelationDto);

    //then
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(1);
    expect(friendsRepository.removeRelation).toHaveBeenCalledTimes(1);
  });
});
