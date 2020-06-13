import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {UserEntity} from './user.entity';
import {PostEntity} from '../posts/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostEntity])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {
}
