import { Injectable } from '@nestjs/common';
import { Friend } from './entity/friend.entity';
import { Brackets, DataSource, Equal, Repository } from 'typeorm';
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

  async findUserRelationsByStatus(userId: number, status: FriendStatus): Promise<Friend[]> {
    return this.createQueryBuilder('friend')
      .leftJoinAndSelect('friend.sender', 'sender')
      .leftJoinAndSelect('friend.receiver', 'receiver')
      .where('friend.status = :status', { status: status })
      .andWhere(
        new Brackets((qb) => {
          qb.where('friend.sender = :senderId', { senderId: userId }).orWhere(
            'friend.receiver = :receiverId',
            { receiverId: userId },
          );
        }),
      )
      .getMany();
  }

  removeRelation(relation: Friend): void {
    this.remove(relation);
  }
}
