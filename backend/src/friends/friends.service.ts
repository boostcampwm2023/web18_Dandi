import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendsRepository } from './friends.repository';
import { UsersRepository } from 'src/users/users.repository';
import { FriendRelationDto } from './dto/friend.dto';
import { Friend } from './entity/friend.entity';

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
    if (relations.length > 0) throw new BadRequestException();
    if (senderId === receiverId) throw new BadRequestException();

    const sender = await this.usersRepository.findById(senderId);
    const receiver = await this.usersRepository.findById(receiverId);
    this.friendsRepository.createFriend(sender, receiver);
  }

  async cancelFriendRequest(friendRelationDto: FriendRelationDto): Promise<void> {
    const { senderId, receiverId } = friendRelationDto;
    const friendRequest = await this.checkFriendData(senderId, receiverId);
    this.friendsRepository.removeRelation(friendRequest);
  }

  // 예외처리(친구 신청 제외한 모든 로직)
  private async checkFriendData(senderId: number, receiverId: number): Promise<Friend> {
    if (senderId === receiverId) throw new BadRequestException();

    const relation = await this.friendsRepository.findFriendRequest(senderId, receiverId);
    if (relation.length !== 1) throw new BadRequestException();

    return relation[0];
  }
}
