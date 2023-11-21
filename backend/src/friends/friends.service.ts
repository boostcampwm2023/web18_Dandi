import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendsRepository } from './friends.repository';
import { UsersRepository } from 'src/users/users.repository';
import { FriendRelationDto } from './dto/friend.dto';
import { Friend } from './entity/friend.entity';
import { FriendStatus } from './entity/friendStatus';

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
    const friendRequest = await this.checkFriendData(friendRelationDto);
    this.friendsRepository.removeRelation(friendRequest);
  }

  async allowFriendRequest(friendRelationDto: FriendRelationDto): Promise<void> {
    const friendRequest = await this.checkFriendData(friendRelationDto);
    this.friendsRepository.updateStatus(friendRequest);
  }

  // 예외처리(친구 신청 제외한 로직)
  private async checkFriendData(friendRelationDto: FriendRelationDto): Promise<Friend> {
    const { senderId, receiverId } = friendRelationDto;
    if (senderId === receiverId)
      throw new BadRequestException('나와는 친구신청 관리를 할 수 없습니다.');

    const relation = await this.friendsRepository.findFriendRequest(senderId, receiverId);
    if (relation.length !== 1)
      throw new BadRequestException('해당 사용자 사이의 친구신청 기록이 없습니다.');

    if (relation[0].status === FriendStatus.COMPLETE) {
      throw new BadRequestException('이미 수락된 친구신청입니다.');
    }
    return relation[0];
  }
}
