import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './post/posts.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/users.module';
import { CategoryModule } from './category/category.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { QueryFailedFilter } from './common/filters/query-failed.filter';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',

        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),

        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),

        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    PostsModule,
    UsersModule,
    CategoryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('posts');
  }
}
