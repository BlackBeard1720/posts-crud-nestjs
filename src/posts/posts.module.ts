import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

const mockPostsService = {
  findAll: () => [{ id: 1, title: 'Mock', content: 'Demo' }],
}
@Module({
  // Đăng ký controller và service cho PostsModule.
  controllers: [PostsController],
  providers: [
    {
      provide: PostsService,
      useValue: mockPostsService,
    },
  ],
})
export class PostsModule {}
