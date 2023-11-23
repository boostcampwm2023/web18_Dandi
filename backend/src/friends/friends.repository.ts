import { Injectable } from '@nestjs/common';
import { Friend } from './entity/friend.entity';
import { DataSource, Equal, Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { FriendStatus } from './entity/friendStatus';

@Injectable()
export class FriendsRepository extends Repository<Friend> {
  constructor(private dataSource: DataSource) {
    super(Friend, dataSource.createEntityManager());
  }

  createFriend(sender: User, receiver: User): void {
    this.save({ sender, receiver });
  }

  async findFriendRequest(senderId: number, receiverId: number): Promise<Friend[]> {
    return await this.findBy({
      sender: Equal(senderId),
      receiver: Equal(receiverId),
    });
  }

  removeRelation(relation: Friend): void {
    this.remove(relation);
  }

  updateStatus(relation: Friend): void {
    this.update(relation.id, { status: FriendStatus.COMPLETE });
  }
}
