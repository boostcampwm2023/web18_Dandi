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

describe('친구 삭제 테스트', () => {
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
    const senderId = 1;
    const receiverId = 1;

    //when - then
    expect(() => friendsService.deleteFriendRelation(senderId, receiverId)).rejects.toThrow(
      new BadRequestException('나와는 친구신청 관리를 할 수 없습니다.'),
    );
    expect(friendsRepository.findRelation).toHaveBeenCalledTimes(0);
  });

  it('친구 관계가 존재하지 않으면 예외 발생', () => {
    //given
    const senderId = 1;
    const receiverId = 2;
    (friendsRepository.findRelation as jest.Mock).mockResolvedValue(null);

    //when - then
    expect(() => friendsService.deleteFriendRelation(senderId, receiverId)).rejects.toThrow(
      new BadRequestException('존재하지 않는 관계입니다.'),
    );
    expect(friendsRepository.findRelation).toHaveBeenCalledTimes(1);
  });

  it('친구 관계가 존재하면 해당 관계 삭제', async () => {
    //given
    const senderId = 1;
    const receiverId = 2;
    const mockFriends = {
      id: 1,
      status: FriendStatus.COMPLETE,
      sender: { id: senderId },
      receiver: { id: receiverId },
    };
    (friendsRepository.findRelation as jest.Mock).mockResolvedValue(mockFriends);

    //when
    await friendsService.deleteFriendRelation(senderId, receiverId);

    //when - then
    expect(friendsRepository.findRelation).toHaveBeenCalledTimes(1);
    expect(friendsRepository.delete).toHaveBeenCalledTimes(1);
  });
});

describe('친구 신청 수락 테스트', () => {
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
    expect(() => friendsService.allowFriendRequest(friendsRelationDto)).rejects.toThrow(
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
      async () => await friendsService.allowFriendRequest(friendsRelationDto),
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
      async () => await friendsService.allowFriendRequest(friendsRelationDto),
    ).rejects.toThrow(new BadRequestException('이미 친구입니다.'));
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(2);
  });

  it('친구 신청 기록이 존재하지 않으면 예외 발생', async () => {
    //given
    const friendsRelationDto = { senderId: 1, receiverId: 2 };
    (friendsRepository.findFriendRequest as jest.Mock).mockReturnValue(null);

    //when - then
    await expect(
      async () => await friendsService.allowFriendRequest(friendsRelationDto),
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
      async () => await friendsService.allowFriendRequest(friendsRelationDto),
    ).rejects.toThrow(new BadRequestException('이미 친구입니다.'));
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(1);
  });

  it('송신한 친구 신청 기록이 존재하면 신청 수락', async () => {
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
    await friendsService.allowFriendRequest(friendsRelationDto);

    //then
    expect(friendsRepository.findFriendRequest).toHaveBeenCalledTimes(1);
    expect(friendsRepository.updateStatus).toHaveBeenCalledTimes(1);
  });
});

describe('친구 목록 조회 테스트', () => {
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

  it('친구 관계가 존재하면, 상대방의 친구 정보 반환', async () => {
    //given
    const friendA = { id: 2, email: 'test2@test.com', nickname: 'test2', profileImage: 'test2' };
    const friendB = { id: 3, email: 'test3@test.com', nickname: 'test3', profileImage: 'test3' };
    const friendC = { id: 4, email: 'test4@test.com', nickname: 'test4', profileImage: 'test4' };
    const mockFriends = [
      {
        id: 1,
        status: FriendStatus.COMPLETE,
        sender: { id: 1, email: 'test1@test.com', nickname: 'test1', profileImage: 'test1' },
        receiver: friendB,
      },
      {
        id: 2,
        status: FriendStatus.COMPLETE,
        sender: friendA,
        receiver: { id: 1, email: 'test1@test.com', nickname: 'test1', profileImage: 'test1' },
      },
      {
        id: 4,
        status: FriendStatus.COMPLETE,
        sender: friendC,
        receiver: { id: 1, email: 'test1@test.com', nickname: 'test1', profileImage: 'test1' },
      },
    ];
    (friendsRepository.findUserRelationsByStatus as jest.Mock).mockResolvedValue(mockFriends);

    //when
    const result = await friendsService.getFriendsList(1);

    //then
    expect(result).toHaveLength(3);
    expect(result).toEqual([friendA, friendB, friendC]);
    expect(friendsRepository.findUserRelationsByStatus).toHaveBeenCalledTimes(1);
  });

  it('친구 관계가 존재하지 않으면 빈 배열 반환', async () => {
    //given
    (friendsRepository.findUserRelationsByStatus as jest.Mock).mockResolvedValue([]);

    //when
    const result = await friendsService.getFriendsList(1);

    //then
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
    expect(friendsRepository.findUserRelationsByStatus).toHaveBeenCalledTimes(1);
  });
});

describe('친구 신청 목록 조회 테스트', () => {
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

  it('친구 신청 정보가 존재하면, 상대방의 프로필 정보 반환', async () => {
    //given
    const friendA = { id: 2, email: 'test2@test.com', nickname: 'test2', profileImage: 'test2' };
    const friendB = { id: 3, email: 'test3@test.com', nickname: 'test3', profileImage: 'test3' };
    const friendC = { id: 4, email: 'test4@test.com', nickname: 'test4', profileImage: 'test4' };
    const mockFriends = [
      {
        id: 1,
        status: FriendStatus.WAITING,
        sender: { id: 1, email: 'test1@test.com', nickname: 'test1', profileImage: 'test1' },
        receiver: friendB,
      },
      {
        id: 2,
        status: FriendStatus.WAITING,
        sender: friendA,
        receiver: { id: 1, email: 'test1@test.com', nickname: 'test1', profileImage: 'test1' },
      },
      {
        id: 4,
        status: FriendStatus.WAITING,
        sender: friendC,
        receiver: { id: 1, email: 'test1@test.com', nickname: 'test1', profileImage: 'test1' },
      },
    ];
    (friendsRepository.findUserRelationsByStatus as jest.Mock).mockResolvedValue(mockFriends);

    //when
    const result = await friendsService.getStrangerList(1);

    //then
    expect(result).toHaveLength(3);
    expect(result[0].nickname).toEqual(friendA.nickname);
    expect(result[1].nickname).toEqual(friendB.nickname);
    expect(result[2].nickname).toEqual(friendC.nickname);
    expect(friendsRepository.findUserRelationsByStatus).toHaveBeenCalledTimes(1);
  });

  it('친구 신청 정보가 존재하지 않으면 빈 배열 반환', async () => {
    //given
    (friendsRepository.findUserRelationsByStatus as jest.Mock).mockResolvedValue([]);

    //when
    const result = await friendsService.getStrangerList(1);

    //then
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
    expect(friendsRepository.findUserRelationsByStatus).toHaveBeenCalledTimes(1);
  });
});

describe('친구 검색 테스트', () => {
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

  it('친구 신청 정보가 존재하면, 상대방의 프로필 정보 반환', async () => {
    //given
    const friendA = { id: 2, email: 'test2@test.com', nickname: 'test2', profileImage: 'test2' };
    const friendB = { id: 3, email: 'test3@test.com', nickname: 'test3', profileImage: 'test3' };
    const friendC = { id: 4, email: 'test4@test.com', nickname: 'test4', profileImage: 'test4' };
    const mockFriends = [
      {
        id: 1,
        status: FriendStatus.WAITING,
        sender: { id: 1, email: 'test1@test.com', nickname: 'test1', profileImage: 'test1' },
        receiver: friendB,
      },
      {
        id: 2,
        status: FriendStatus.WAITING,
        sender: friendA,
        receiver: { id: 1, email: 'test1@test.com', nickname: 'test1', profileImage: 'test1' },
      },
      {
        id: 4,
        status: FriendStatus.WAITING,
        sender: friendC,
        receiver: { id: 1, email: 'test1@test.com', nickname: 'test1', profileImage: 'test1' },
      },
    ];
    (friendsRepository.findUserRelationsByStatus as jest.Mock).mockResolvedValue(mockFriends);

    //when
    const result = await friendsService.searchFriend(1, friendA.nickname);

    //then
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(friendA);
    expect(friendsRepository.findUserRelationsByStatus).toHaveBeenCalledTimes(1);
  });

  it('친구 신청 정보가 존재하지 않으면 null 반환', async () => {
    //given
    (friendsRepository.findUserRelationsByStatus as jest.Mock).mockResolvedValue([]);

    //when
    const result = await friendsService.searchFriend(1, 'testNull');

    //then
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
    expect(friendsRepository.findUserRelationsByStatus).toHaveBeenCalledTimes(1);
  });
});
