import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { slowApiLoggerMiddleware } from './common/middlewares/slow-api-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(slowApiLoggerMiddleware);
  // Bật global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Bật interceptor toàn cục để chuẩn hóa phản hồi API.
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
