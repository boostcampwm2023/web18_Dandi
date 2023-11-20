import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SocialType } from './socialType';
import { Friend } from 'src/friends/entity/friend.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  socialId: string;

  @Column()
  socialType: SocialType;

  @Column()
  profileImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Friend, (friend) => friend.sender, {
    cascade: true,
  })
  sender: Friend[];

  @OneToMany(() => Friend, (friend) => friend.receiver, {
    cascade: true,
  })
  receiver: Friend[];
}
