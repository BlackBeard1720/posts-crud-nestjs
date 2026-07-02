import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Post } from 'src/post/entities/post.entity';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneWithPosts(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        posts: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneForAuth(username: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: passwordHash,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.usersRepository.findOneByOrFail({
      id: savedUser.id,
    });
  }

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      user: user,
    });

    return this.postsRepository.save(post);
  }
}
