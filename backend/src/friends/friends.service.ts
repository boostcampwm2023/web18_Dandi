import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendsRepository } from './friends.repository';
import { UsersRepository } from 'src/users/users.repository';
import { createFriendto } from './dto/friend.dto';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendsRepository: FriendsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async requestFriend(createFriendto: createFriendto): Promise<void> {
    const { senderId, receiverId } = createFriendto;

    // 예외처리
    const relations = await this.friendsRepository.findFriendRequest(senderId, receiverId);
    if (relations.length > 0) throw new BadRequestException();
    if (senderId === receiverId) throw new BadRequestException();

    const sender = await this.usersRepository.findById(senderId);
    const receiver = await this.usersRepository.findById(receiverId);

    this.friendsRepository.createFriend(sender, receiver);
  }
}
