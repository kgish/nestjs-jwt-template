import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserEntity } from './post.entity';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserEntity])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
