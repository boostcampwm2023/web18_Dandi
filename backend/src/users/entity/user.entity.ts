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
import { Diary } from 'src/diaries/entity/diary.entity';

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

  @Column({ length: 2083 })
  profileImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Diary, (diary) => diary.author, { cascade: true, lazy: true })
  diaries: Diary[];

  @OneToMany(() => Friend, (friend) => friend.sender, { cascade: true, lazy: true })
  sender: Friend[];

  @OneToMany(() => Friend, (friend) => friend.receiver, { cascade: true, lazy: true })
  receiver: Friend[];
}
