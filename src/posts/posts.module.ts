import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  // Đăng ký controller và service cho PostsModule.
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
