import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {PostEntity} from './post.entity';
import {PostRO} from './interfaces';
import {PostDto} from './dto';

@Injectable()
export class PostsService {

  private logger: Logger;

  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>) {
    this.logger = new Logger('PostsService');
  }

  async create(data: PostDto): Promise<PostRO> {
    // this.logger.log(`create(data='${JSON.stringify(data)}')`);
    const post = await this.postRepository.create(data);
    await this.postRepository.save(post);
    const result = post.toResponseObject();
    this.logger.log(`create(data='${JSON.stringify(data)}') => '${JSON.stringify(result)}'`);
    return result;
  }

  async findAll(): Promise<PostRO[]> {
    // this.logger.log('findAll()');
    const posts: PostEntity[] = await this.postRepository.find();
    const result = posts.map(post => post.toResponseObject());
    this.logger.log(`findAll() => '${JSON.stringify(result)}'`);
    return result;
  }

  async findOne(id: string): Promise<PostRO> {
    // this.logger.log(`findOne(id='${id}')`);
    const post = await this.postRepository.findOne({where: {id}});
    if (!post) {
      this.logger.log(`findOne(id='${id}') => HTTP Exception NOT_FOUND`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const result = post.toResponseObject();
    this.logger.log(`findOne(id='${id}') => '${JSON.stringify(result)}'`);
    return result;
  }

  async update(id: string, data: Partial<PostDto>): Promise<PostRO> {
    // this.logger.log(`update(id='${id}',data='${JSON.stringify(data)}')`);
    let post = await this.postRepository.findOne({where: {id}});
    if (!post) {
      this.logger.log(`update(id='${id}',data='${JSON.stringify(data)}') => HTTP Exception NOT_FOUND`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.update({id}, data);
    post = await this.postRepository.findOne({where: {id}});
    const result = post.toResponseObject();
    this.logger.log(`update(id='${id}',data='${JSON.stringify(data)}') => '${JSON.stringify(result)}'`);
    return result;
  }

  async delete(id: string): Promise<PostRO> {
    // this.logger.log(`delete(id='${id}')`);
    const post = await this.postRepository.findOne({where: {id}});
    if (!post) {
      this.logger.log(`delete(id='${id}') => HTTP Exception NOT_FOUND`);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.delete({id});
    const result = post.toResponseObject();
    this.logger.log(`delete(id='${id}') => '${JSON.stringify(result)}'`);
    return result;
  }
}
