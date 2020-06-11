import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostDto } from './dto/post.dto';
import { PostEntity } from './post.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class PostService {

  private logger: Logger;

  constructor(
    @InjectRepository(PostEntity)
    private postEntityRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>) {
    this.logger = new Logger('PostService');
    this.logger.log('constructor()');
  }

  async create(data: PostDto): Promise<PostEntity> {
    const post = await this.postEntityRepository.create(data);
    await this.postEntityRepository.save(post);
    return post;
  }

  async findAll(): Promise<PostEntity[]> {
    const posts = await this.postEntityRepository.find({ relations: ['author'] });
    return posts;
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postEntityRepository.findOne({ where: { id }, relations: ['author'] });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async update(id: string, data: Partial<PostDto>): Promise<PostEntity> {
    let post = await this.postEntityRepository.findOne({ where: { id } });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.postEntityRepository.update({ id }, data);
    post = await this.postEntityRepository.findOne({ where: { id } });
    return post;
  }

  async delete(id: string): Promise<PostEntity> {
    const post = await this.postEntityRepository.findOne({ where: { id } });
    if (!post) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.postEntityRepository.delete({ id });
    return post;
  }
}
