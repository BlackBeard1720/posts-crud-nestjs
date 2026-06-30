import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { slowApiLoggerMiddleware } from './common/middlewares/slow-api-logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Rencity Training API')
    .setDescription('Api posts, users, category')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
