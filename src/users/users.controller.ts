import {
  Body,
  Controller,
  Get,
  Post,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { User } from './entities/user.entity';
import { Post as PostEntity } from 'src/posts/entities/post.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post(':userId/posts')
  createPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return this.usersService.createPost(userId, createPostDto);
  }
}
