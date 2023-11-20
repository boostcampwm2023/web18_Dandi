import { Injectable } from '@nestjs/common';
import { Friend } from './entity/friend.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class FriendsRepository extends Repository<Friend> {
  constructor(private dataSource: DataSource) {
    super(Friend, dataSource.createEntityManager());
  }

  createFriend(sender: User, receiver: User): void {
    const friend = new Friend();
    friend.sender = sender;
    friend.receiver = receiver;
    this.save(friend);
  }

  async findFriendRequest(senderId: number, receiverId: number) {
    return this.createQueryBuilder('friend')
      .where('friend.sender = :sender', { sender: senderId })
      .andWhere('friend.receiver = :receiver', { receiver: receiverId })
      .getMany();
  }
}
