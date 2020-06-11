import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

import {UserEntity} from './user.entity';
import {UserRO} from './interfaces';
import {PostEntity} from '../post/post.entity';

@Injectable()
export class UserService {

  private logger: Logger;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private operatorRepository: Repository<PostEntity>) {
    this.logger = new Logger('UserService');
    this.logger.log('constructor()');
  }

  async findAll(): Promise<UserRO[]> {
    const users = await this.userRepository.find({relations: ['posts']});
    return users.map(user => user.toResponseObject());
  }

  async findOne(id: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({where: {id}, relations: ['posts']});
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user.toResponseObject();
  }

  async findOneUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({where: {username}});
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}

