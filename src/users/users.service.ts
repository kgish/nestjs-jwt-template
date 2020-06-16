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
  }

  async create(data: UserDto): Promise<UserRO> {
    // this.logger.log(`create(data='${JSON.stringify(data)}')`);
    const userRO = await this.userRepository.create(data);
    await this.userRepository.save(userRO);
    const result = userRO.toResponseObject();
    this.logger.log(`create(data='${JSON.stringify(data)}') => '${JSON.stringify(result)}'`);
    return result;
  }

  async findAll(): Promise<UserRO[]> {
    // this.logger.log('findAll()');
    const users: UserEntity[] = await this.userRepository.find();
    const result = users.map(user => user.toResponseObject());
    this.logger.log(`findAll()' => '${JSON.stringify(result)}'`);
    return result;
  }

  async findOne(id: string): Promise<UserRO> {
    // this.logger.log(`findOne(id='${id}')`);
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      this.logger.log(`findOne(id='${id}') => HTTP Exception NOT_FOUND`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const result = user.toResponseObject();
    this.logger.log(`findOne(id='${id}') => '${JSON.stringify(result)}'`);
    return result;
  }

  async findOneUsername(username: string): Promise<UserEntity> {
    // this.logger.log(`findOneUserName(username='${username}')`);
    const user = await this.userRepository.findOne({where: {username}});
    if (!user) {
      this.logger.log(`findOneUserName(username='${username}') => HTTP Exception NOT_FOUND`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.logger.log(`findOneUsername(username='${username}') => '${JSON.stringify(user.toResponseObject())}'`);
    return user;
  }

  async update(id: string, data: Partial<UserDto>): Promise<UserRO> {
    // this.logger.log(`update(id='${id}',data='${JSON.stringify(data)}')`);
    let user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      this.logger.log(`update(id='${id}',data='${JSON.stringify(data)}') => HTTP Exception NOT_FOUND`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update({id}, data);
    user = await this.userRepository.findOne({where: {id}});
    const result = user.toResponseObject();
    this.logger.log(`update(id='${id}',data='${JSON.stringify(data)}') => '${JSON.stringify(result)}'`);
    return result;
  }

  async delete(id: string): Promise<UserRO> {
    // this.logger.log(`delete(id='${id}')`);
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      this.logger.log(`delete(id='${id}') => HTTP Exception NOT_FOUND`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete({id});
    const result = user.toResponseObject();
    this.logger.log(`delete(id='${id}') => '${JSON.stringify(result)}'`);
    return result;
  }
}

