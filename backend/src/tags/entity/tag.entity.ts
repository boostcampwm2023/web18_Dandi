import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Diary } from '../../diaries/entity/diary.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Diary, { cascade: true })
  diaries: Diary[];
}
