import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        // 1. host.switchToHttp() giúp ta lấy được môi trường HTTP hiện tại
        const ctx = host.switchToHttp();

        // 2. Từ môi trường này, ta lấy được Request và Response của Express
        const response = ctx.getResponse<Response>();

        // 3. Lấy status code (ví dụ: 404, 400)
        const status = exception.getStatus();

        const exceptionResponse: any = exception.getResponse();

        let message = '';
        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else {
            message = exceptionResponse.message;
        }
        console.log(message)
        // 4. Trả về cho Frontend một JSON theo ý ta muốn
        response
            .status(status)
            .json({
                success: false,
                code: status,
                msg: Array.isArray(message) ? message[0] : message,
            });
    }
}
