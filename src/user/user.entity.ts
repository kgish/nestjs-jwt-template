import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { hash, compare } from 'bcryptjs';

import { UserRO, Role } from './interfaces';
import { PostEntity } from '../post/post.entity';
import { BaseEntity } from '../shared/base.entity';

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
  @OneToMany(type => PostEntity, post => post.author, { eager: true })
  posts: PostEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.salt = await bcrypt.genSalt();
    this.password = await hash(this.password, this.salt);
  }

  toResponseObject(): UserRO {
    const {id, username, name, role, created, updated} = this;
    return {id, username, name, role, created, updated} as UserRO;
  }

  async comparePassword(attempt: string) {
    return await compare(attempt, this.password);
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  static get modelName(): string {
    return 'User';
  }
}
