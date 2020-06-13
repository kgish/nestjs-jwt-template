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
    this.logger = new Logger('PostService');
    this.logger.log('constructor()');
  }

  async create(data: PostDto): Promise<PostRO> {
    const post = await this.postRepository.create(data);
    await this.postRepository.save(post);
    return post;
  }

  async findAll(): Promise<PostRO[]> {
    return await this.postRepository.find();
  }

  async findOne(id: string): Promise<PostRO> {
    const post = await this.postRepository.findOne({where: {id}, relations: ['author']});
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async update(id: string, data: Partial<PostDto>): Promise<PostRO> {
    let post = await this.postRepository.findOne({where: {id}});
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.update({id}, data);
    post = await this.postRepository.findOne({where: {id}});
    return post;
  }

  async delete(id: string): Promise<PostRO> {
    const post = await this.postRepository.findOne({where: {id}});
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.delete({id});
    return post;
  }
}
