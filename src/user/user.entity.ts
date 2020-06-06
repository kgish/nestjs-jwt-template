import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';

import { hash, compare } from 'bcryptjs';

import { UserRO, Role } from './interfaces';
import { OperatorEntity } from '../operator/operator.entity';
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

  @ManyToOne(type => OperatorEntity, operator => operator.users)
  operator: OperatorEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  toResponseObject(): UserRO {
    const {id, username, name, role, created, updated} = this;
    return {id, username, name, role, created, updated} as UserRO;
  }

  async comparePassword(attempt: string) {
    return await compare(attempt, this.password);
  }

  static get modelName(): string {
    return 'User';
  }
}
