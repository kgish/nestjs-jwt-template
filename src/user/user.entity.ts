import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import {hash, compare, genSalt} from 'bcryptjs';

import {UserRO, Role} from './interfaces';
import {BaseEntity} from '../shared/base.entity';
import {PostEntity} from "../post/post.entity";

@Entity('user')
export class UserEntity extends BaseEntity {

  @Column({type: 'text', unique: true})
  username: string;

  @Column({type: 'text'})
  name: string;

  @Column({type: 'text'})
  password: string;

  @Column()
  role: Role;

  @Column()
  salt: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => PostEntity, post => post.author, {eager: true})
  posts: PostEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.salt = await genSalt();
    this.password = await hash(this.password, this.salt);
  }

  toResponseObject(): UserRO {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, salt, ...userRO} = this;
    return userRO;
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await compare(attempt, this.password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return (await hash(password, this.salt) === this.password);
  }

  static get modelName(): string {
    return 'User';
  }
}
