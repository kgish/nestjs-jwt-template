import {
  Column,
  Entity,
  OneToMany
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { BaseEntity } from '../shared/base.entity';

@Entity('operator')
export class OperatorEntity extends BaseEntity {

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @OneToMany(type => UserEntity, user => user.operator)
  users: UserEntity[];

  static get modelName(): string {
    return 'Operator';
  }
}
