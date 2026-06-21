import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
}

@Injectable()
// Chuẩn hóa dữ liệu trả về cho mọi API trong app.
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    // Lấy request và response hiện tại từ HTTP context.
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let message = 'Data retrieved successfully';
    const { method } = request;

    // Đổi message thành công theo từng HTTP method.
    switch (method) {
      case 'POST':
        message = 'Created successfully';
        break;
      case 'PUT':
      case 'PATCH':
        message = 'Updated successfully';
        break;
      case 'DELETE':
        message = 'Deleted successfully';
        break;
    }

    return next.handle().pipe(
      // Bọc dữ liệu trả về thành format API thống nhất.
      map((data) => ({
        statusCode: response.statusCode,
        message: message,
        data: data ?? null,
      })),
    );
  }
}
