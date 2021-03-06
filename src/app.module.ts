import {Logger, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';

import * as path from 'path';
import * as fs from 'fs';

import {AppController} from './app.controller';
import {AppService} from './app.service';

import {HttpExceptionFilter} from './shared/filters';
import {LoggingInterceptor} from './shared/interceptors';

import {AuthModule} from './auth/auth.module';
import {PostsModule} from './posts/posts.module';
import {UsersModule} from './users/users.module';

import {configuration} from './config';

const config = configuration();

@Module({
  imports: [
    AuthModule,
    PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.database,
      synchronize: config.db.synchronize,
      logging: config.db.logging,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {

  private logger: Logger;

  constructor() {
    this.logger = new Logger('AppModule');

    const dotenv = path.resolve(__dirname, '..', '.env');
    if (fs.existsSync(dotenv)) {
      this.logger.log(`Found .env at ${dotenv}`);
    } else {
      this.logger.warn(`WARNING: Cannot find .env at ${dotenv}`);
    }
  }
}
