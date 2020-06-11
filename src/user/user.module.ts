import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { PostEntity } from '../post/post.entity';
import { AuthService } from '../auth/auth.service';
import {AuthModule} from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostEntity])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {
}
