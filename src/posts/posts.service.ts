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
    this.logger.log('constructor()');
  }

  async create(data: PostDto): Promise<PostRO> {
    const post = await this.postRepository.create(data);
    await this.postRepository.save(post);
    return post.toResponseObject();
  }

  async findAll(): Promise<PostRO[]> {
    const posts: PostEntity[] = await this.postRepository.find();
    return posts.map(post => post.toResponseObject());
  }

  async findOne(id: string): Promise<PostRO> {
    const post = await this.postRepository.findOne({where: {id}});
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return post.toResponseObject();
  }

  async update(id: string, data: Partial<PostDto>): Promise<PostRO> {
    let post = await this.postRepository.findOne({where: {id}});
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.update({id}, data);
    post = await this.postRepository.findOne({where: {id}});
    return post.toResponseObject();
  }

  async delete(id: string): Promise<PostRO> {
    const post = await this.postRepository.findOne({where: {id}});
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.delete({id});
    return post.toResponseObject();
  }
}
