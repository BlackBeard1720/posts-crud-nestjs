Ok, 3 bước này nối rất đẹp với phần bạn vừa làm. Mình sẽ hướng dẫn theo code hiện tại của bạn:

- Relation trong `Post` tên là `user`
- Không dùng tên `author`
- Endpoint tạo post chuẩn RESTful bạn đã chọn là `POST /users/:userId/posts`

Bây giờ làm tiếp:

## 6. API lấy user kèm danh sách posts

RESTful nên là:

```http
GET /users/:id
```

Response mong muốn:

```json
{
  "id": 1,
  "username": "ren",
  "isActive": true,
  "posts": [
    {
      "id": 1,
      "title": "Post 1",
      "content": "..."
    }
  ]
}
```

Trong `UsersService`, thêm method kiểu:

```ts
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
```

Trong `UsersController`, thêm endpoint:

```ts
@Get(':id')
findOneWithPosts(
  @Param('id', ParseIntPipe) id: number,
): Promise<User> {
  return this.usersService.findOneWithPosts(id);
}
```

Nhớ controller đã import `Param`, `ParseIntPipe` rồi nên gần như đủ.

---

## 7. API lấy posts kèm author/user

Vì entity của bạn đặt tên relation là `user`, response sẽ là:

```json
{
  "id": 1,
  "title": "Post 1",
  "user": {
    "id": 1,
    "username": "ren",
    "isActive": true
  }
}
```

Nếu bài ghi là “author”, bạn hiểu là “người viết bài”. Trong code của bạn chính là `user`.

Có 2 API nên hỗ trợ:

```http
GET /posts
GET /posts/:id
```

Với `GET /posts/:id`, trong `PostsService.findOne`, hiện tại bạn đang dùng:

```ts
const post = await this.postsRepository.findOneBy({ id });
```

Cái này không load user.

Bạn đổi ý tưởng thành:

```ts
const post = await this.postsRepository.findOne({
  where: { id },
  relations: {
    user: true,
  },
});
```

Như vậy `GET /posts/1` sẽ trả post kèm user.

---

## 8. Dùng QueryBuilder join author/user

Bước này áp dụng cho `GET /posts`, vì hiện tại `findAll` của bạn đã dùng QueryBuilder rồi.

Trong `PostsService.findAll`, bạn đang có:

```ts
const qb = this.postsRepository.createQueryBuilder('post');
```

Bạn thêm join:

```ts
const qb = this.postsRepository
  .createQueryBuilder('post')
  .leftJoinAndSelect('post.user', 'user');
```

Ý nghĩa:

```ts
.leftJoinAndSelect('post.user', 'user')
```

là:

> Khi lấy post, join thêm bảng user và trả luôn thông tin user trong response.

Sau đó các đoạn search/filter/pagination hiện tại của bạn giữ nguyên.

Nếu muốn search thêm theo username, bạn có thể mở rộng đoạn search:

```ts
.orWhere('user.username LIKE :search', {
  search: `%${query.search}%`,
});
```

Nhưng bước đầu chỉ cần join là đủ.

---

Chốt thứ tự nên làm:

1. `UsersService`: thêm `findOneWithPosts`.
2. `UsersController`: thêm `GET /users/:id`.
3. `PostsService.findOne`: đổi sang `findOne({ relations: { user: true } })`.
4. `PostsService.findAll`: thêm `leftJoinAndSelect('post.user', 'user')`.

Lưu ý nhỏ: trong bài ghi “author”, nhưng project của bạn đang dùng tên `user`. Vậy trong code nên dùng nhất quán `user`. Nếu muốn response là `author`, lúc đó mới nên đổi relation từ `user` sang `author`, nhưng hiện tại chưa cần.