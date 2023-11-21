import { Diary } from 'src/diaries/entity/diary.entity';
import { User } from 'src/users/entity/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Reaction extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  reaction: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Diary, (diary) => diary.reactions, { nullable: false })
  diary: Diary;
}
