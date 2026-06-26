import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository, Brackets } from 'typeorm';
import { QueryPostDto } from './dto/query-post.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async findAll(query: QueryPostDto): Promise<PaginatedResult<Post>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';

    const qb = this.postsRepository.createQueryBuilder('post')
    .leftJoinAndSelect('post.user', 'user');

    if (query.status) {
      qb.andWhere('post.status = :status', {
        status: query.status,
      });
    }

    if (query.search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('post.title LIKE :search', {
            search: `%${query.search}%`,
          }).orWhere('post.content LIKE :search', {
            search: `%${query.search}%`,
          });
        }),
      );
    }

    qb.orderBy(`post.${sortBy}`, sortOrder).skip(skip).take(limit);

    const [posts, total] = await qb.getManyAndCount();

    return {
      items: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      }
    });

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    return post;
  }

  create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    const updatedPost = Object.assign({}, post, updatePostDto);

    return this.postsRepository.save(updatedPost);
  }

  async remove(id: number): Promise<void> {
    const post = await this.postsRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    await this.postsRepository.delete(id);
  }
}
