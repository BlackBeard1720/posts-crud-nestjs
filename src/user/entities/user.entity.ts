import { Post } from 'src/post/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  username!: string;

  @Column({
    select: false,
  })
  password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];
}
