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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiaryStatus } from './diaryStatus';
import { Tag } from '../../tags/entity/tag.entity';

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
