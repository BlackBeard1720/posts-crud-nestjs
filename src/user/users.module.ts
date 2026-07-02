import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersController],
})
export class UsersModule {}
