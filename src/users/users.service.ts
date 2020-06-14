import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

import {UserEntity} from './user.entity';
import {UserRO} from './interfaces';
import {UserDto} from './dto';

@Injectable()
export class UsersService {

  private logger: Logger;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>) {
    this.logger = new Logger('UsersService');
    this.logger.log('constructor()');
  }

  async create(data: UserDto): Promise<UserRO> {
    const userRO = await this.userRepository.create(data);
    await this.userRepository.save(userRO);
    return userRO;
  }

  async findAll(): Promise<UserRO[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({where: {id}, relations: ['author']});
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneUsername(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({where: {username}});
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: string, data: Partial<UserDto>): Promise<UserRO> {
    let user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update({id}, data);
    user = await this.userRepository.findOne({where: {id}});
    return user;
  }

  async delete(id: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete({id});
    return user;
  }
}

