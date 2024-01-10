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
    if (senderId === receiverId) {
      throw new BadRequestException('나에게 친구신청 보낼 수 없습니다.');
    }

    const relation = await this.friendsRepository.findFriendRequest(senderId, receiverId);
    if (relation) {
      throw new BadRequestException('이미 친구신청을 하셨습니다.');
    }

    const reverseRelation = await this.friendsRepository.findFriendRequest(receiverId, senderId);
    if (reverseRelation) {
      throw new BadRequestException('상대의 친구신청을 확인해주세요.');
    }

    const sender = await this.usersRepository.findById(senderId);
    const receiver = await this.usersRepository.findById(receiverId);
    this.friendsRepository.createFriend(sender, receiver);
  }

  async cancelFriendRequest(friendRelationDto: FriendRelationDto): Promise<void> {
    const friendRequest = await this.checkFriendData(
      friendRelationDto.senderId,
      friendRelationDto.receiverId,
    );
    this.friendsRepository.removeRelation(friendRequest);
  }

  async deleteFriendRelation(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new BadRequestException('나와는 친구신청 관리를 할 수 없습니다.');
    }

    const friendRelation = await this.friendsRepository.findRelation(userId, friendId);
    if (!friendRelation) {
      throw new BadRequestException('존재하지 않는 관계입니다.');
    }
    await this.friendsRepository.delete(friendRelation.id);
  }

  async allowFriendRequest(friendRelationDto: FriendRelationDto): Promise<void> {
    const friendRequest = await this.checkFriendData(
      friendRelationDto.senderId,
      friendRelationDto.receiverId,
    );
    this.friendsRepository.updateStatus(friendRequest);
  }

  async getFriendsList(userId: number): Promise<SearchUserResponseDto[]> {
    const friendRelations = await this.friendsRepository.findUserRelationsByStatus(
      userId,
      FriendStatus.COMPLETE,
    );

    const friends: SearchUserResponseDto[] = friendRelations.map((relation) => {
      const friend = relation.sender.id === userId ? relation.receiver : relation.sender;

      return {
        id: friend.id,
        email: friend.email,
        nickname: friend.nickname,
        profileImage: friend.profileImage,
      };
    });

    return this.sortByNickname(friends);
  }

  async getStrangerList(userId: number): Promise<StrangerResponseDto[]> {
    const strangerRelations = await this.friendsRepository.findUserRelationsByStatus(
      userId,
      FriendStatus.WAITING,
    );

    const strangers: StrangerResponseDto[] = strangerRelations.map((relation) => {
      const stranger = relation.sender.id === userId ? relation.receiver : relation.sender;

      return {
        senderId: relation.sender.id,
        receiverId: relation.receiver.id,
        email: stranger.email,
        nickname: stranger.nickname,
        profileImage: stranger.profileImage,
      };
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

  // 예외처리(친구 신청 제외한 로직 : 신청 취소, 신청 수락, 신청 거절)
  private async checkFriendData(senderId: number, receiverId: number): Promise<Friend> {
    if (senderId === receiverId) {
      throw new BadRequestException('나와는 친구신청 관리를 할 수 없습니다.');
    }

    const relation = await this.friendsRepository.findFriendRequest(senderId, receiverId);
    if (!relation) {
      const reverseRelation = await this.friendsRepository.findFriendRequest(receiverId, senderId);

      if (reverseRelation) {
        this.checkAlreadyFriend(reverseRelation);

        throw new BadRequestException('상대의 친구신청을 확인하세요.');
      } else {
        throw new BadRequestException('해당 사용자 사이의 친구신청 기록이 없습니다.');
      }
    }

    this.checkAlreadyFriend(relation);
    return relation;
  }

  private checkAlreadyFriend(relation: Friend) {
    if (relation.status === FriendStatus.COMPLETE) {
      throw new BadRequestException('이미 친구입니다.');
    }
  }
}
