import { User } from 'src/users/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiaryStatus } from './diaryStatus';
import { Tag } from '../../tags/entity/tag.entity';
import { Reaction } from 'src/reactions/entity/reaction.entity';

@Entity()
export class Diary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column()
  emotion: string;

  @Column()
  mood: number;

  @Column()
  status: DiaryStatus;

  @ManyToOne(() => User, { nullable: false, lazy: true })
  author: User;

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @ManyToMany(() => Tag, { cascade: true, lazy: true })
  @JoinTable({
    name: 'diary_tag',
    joinColumn: { name: 'diary_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
