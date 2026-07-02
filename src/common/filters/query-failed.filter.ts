import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

// Chỉ bắt riêng các lỗi thuộc class QueryFailedError của TypeORM
@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  private readonly logger = new Logger(QueryFailedFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. IN LOG RA TERMINAL CHO DEVELOPER ĐỌC
    this.logger.error('======================================');
    this.logger.error(
      `🔥 QUERY FAILED ERROR: ${request.method} ${request.url}`,
    );
    this.logger.error(`❌ Error message: ${exception.message}`);

    // Ép kiểu để lấy chi tiết lỗi MySQL
    const driverError = (exception as any).driverError;
    if (driverError) {
      this.logger.error(`❌ SQL Code: ${driverError.code}`);
      this.logger.error(`❌ SQL Query: ${driverError.sql}`);
    }
    this.logger.error('======================================');

    // 2. TRẢ VỀ JSON CHO FRONTEND (Giấu hết thông tin nhạy cảm)
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: 'Hệ thống đang gặp sự cố về dữ liệu (Database error)',
    });
  }
}
