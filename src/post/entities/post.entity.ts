import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PostStatus } from '../enums/post-status.enum';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
  })
  user!: User;

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'post_category',
  })
  categories!: Category[];
}
