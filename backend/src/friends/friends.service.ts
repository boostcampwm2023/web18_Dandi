import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendsRepository } from './friends.repository';
import { UsersRepository } from 'src/users/users.repository';
import { FriendRelationDto, StrangerResponseDto } from './dto/friend.dto';
import { Friend } from './entity/friend.entity';
import { SearchUserResponseDto } from 'src/users/dto/user.dto';
import { FriendStatus } from './entity/friendStatus';
import { SortedUsersType } from './utils/friendsType';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendsRepository: FriendsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async requestFriend(friendRelationDto: FriendRelationDto): Promise<void> {
    const { senderId, receiverId } = friendRelationDto;

    // 예외처리
    const relations = await this.friendsRepository.findFriendRequest(senderId, receiverId);
    if (relations.length > 0) throw new BadRequestException('이미 친구신청을 하셨습니다.');
    if (senderId === receiverId) throw new BadRequestException('나에게 친구신청 보낼 수 없습니다.');

    const sender = await this.usersRepository.findById(senderId);
    const receiver = await this.usersRepository.findById(receiverId);
    this.friendsRepository.createFriend(sender, receiver);
  }

  async cancelFriendRequest(friendRelationDto: FriendRelationDto): Promise<void> {
    const { senderId, receiverId } = friendRelationDto;
    const friendRequest = await this.checkFriendData(senderId, receiverId);
    this.friendsRepository.removeRelation(friendRequest);
  }

  async getFriendsList(userId: number): Promise<SearchUserResponseDto[]> {
    const friendRelations = await this.friendsRepository.findUserRelationsByStatus(
      userId,
      FriendStatus.COMPLETE,
    );

    const friends: SearchUserResponseDto[] = [];
    friendRelations.forEach((relation) => {
      const friend = relation.sender.id === userId ? relation.receiver : relation.sender;

      friends.push({
        id: friend.id,
        email: friend.email,
        nickname: friend.nickname,
        profileImage: friend.profileImage,
      });
    });

    return this.sortByNickname(friends);
  }

  async getStrangerList(userId: number): Promise<StrangerResponseDto[]> {
    const strangerRelations = await this.friendsRepository.findUserRelationsByStatus(
      userId,
      FriendStatus.WAITING,
    );

    const strangers: StrangerResponseDto[] = [];
    strangerRelations.forEach((relation) => {
      const stranger = relation.sender.id === userId ? relation.receiver : relation.sender;

      strangers.push({
        senderId: relation.sender.id,
        receiverId: relation.receiver.id,
        email: stranger.email,
        nickname: stranger.nickname,
        profileImage: stranger.profileImage,
      });
    });

    return this.sortByNickname(strangers);
  }

  async searchFriend(userId: number, nickname: string): Promise<SearchUserResponseDto[]> {
    const friends = await this.getFriendsList(userId);
    return friends.filter((friend) => friend.nickname.includes(nickname));
  }

  private sortByNickname<T extends SearchUserResponseDto[] | StrangerResponseDto[]>(
    users: T,
  ): SortedUsersType<T> {
    return users.sort((a, b) => {
      const nameA = a.nickname.toUpperCase();
      const nameB = b.nickname.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    }) as SortedUsersType<T>;
  }

  // 예외처리(친구 신청 제외한 모든 로직)
  private async checkFriendData(senderId: number, receiverId: number): Promise<Friend> {
    if (senderId === receiverId) throw new BadRequestException('나에게 친구신청 보낼 수 없습니다.');

    const relation = await this.friendsRepository.findFriendRequest(senderId, receiverId);
    if (relation.length !== 1)
      throw new BadRequestException('해당 사용자에게 친구신청을 보낸 기록이 없습니다.');

    return relation[0];
  }
}
