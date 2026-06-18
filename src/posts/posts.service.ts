import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  // Lưu dữ liệu bài viết tạm trong bộ nhớ.
  private posts: { id: number; title: string; content: string }[] = [];
  private idCount = 0;
  create(createPostDto: CreatePostDto) {
    // Tạo bài viết mới với id tự tăng.
    const newPost = { id: ++this.idCount, ...createPostDto };
    this.posts.push(newPost);
    return newPost;
  }
  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    // Tìm bài viết theo id và báo lỗi nếu không có.
    const post = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    // Cập nhật bài viết hiện có theo id.
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    this.posts[index] = { ...this.posts[index], ...updatePostDto };
    return this.posts[index];
  }

  remove(id: number) {
    // Xóa bài viết khỏi mảng dữ liệu tạm.
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    const deletedPost = this.posts.splice(index, 1);
    return deletedPost;
  }
}
