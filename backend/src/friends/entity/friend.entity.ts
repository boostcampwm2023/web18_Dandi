import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FriendStatus } from './friendStatus';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: FriendStatus.WAITING, nullable: true })
  status?: FriendStatus;

  @ManyToOne(() => User, (user) => user.sender, {
    nullable: false,
  })
  sender: User;

  @ManyToOne(() => User, (user) => user.receiver, {
    nullable: false,
  })
  receiver: User;
}
