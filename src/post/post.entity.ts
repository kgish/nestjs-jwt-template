import {
  Column,
  Entity,
  ManyToOne
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { BaseEntity } from '../shared/base.entity';

@Entity('post')
export class PostEntity extends BaseEntity {

  @Column({ unique: true })
  title: string;

  @Column()
  body: string;

  @ManyToOne(type => UserEntity, user => user.posts, { eager: false })
  author: UserEntity;

  @Column()
  authorId: string;

  static get modelName(): string {
    return 'Post';
  }
}
