import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendsRepository } from './friends.repository';
import { UsersRepository } from 'src/users/users.repository';
import { FriendRelationDto, StrangerResponseDto } from './dto/friend.dto';
import { Friend } from './entity/friend.entity';
import { SearchUserResponseDto } from 'src/users/dto/user.dto';
import { FriendStatus } from './entity/friendStatus';
import { User } from 'src/users/entity/user.entity';

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

    const friends = [];
    friendRelations.forEach((relation) => {
      let friend: User;
      if (relation.sender.id === userId) {
        friend = relation.receiver;
      } else {
        friend = relation.sender;
      }

      friends.push({
        id: friend.id,
        email: friend.email,
        nickname: friend.nickname,
        profileImage: friend.profileImage,
      });
    });

    return friends.sort((a: SearchUserResponseDto, b: SearchUserResponseDto) => {
      const nameA = a.nickname.toUpperCase();
      const nameB = b.nickname.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  async getStrangerList(userId: number): Promise<StrangerResponseDto[]> {
    const strangerRelations = await this.friendsRepository.findUserRelationsByStatus(
      userId,
      FriendStatus.WAITING,
    );

    const strangers = [];
    strangerRelations.forEach((relation) => {
      let stranger: User;
      if (relation.sender.id === userId) {
        stranger = relation.receiver;
      } else {
        stranger = relation.sender;
      }

      strangers.push({
        senderId: relation.sender.id,
        receiverId: relation.receiver.id,
        email: stranger.email,
        nickname: stranger.nickname,
        profileImage: stranger.profileImage,
      });
    });

    return strangers.sort((a: StrangerResponseDto, b: StrangerResponseDto) => {
      const nameA = a.nickname.toUpperCase();
      const nameB = b.nickname.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
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
