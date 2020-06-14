import {Injectable, Logger} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

import {UsersService} from '../users/users.service';
import {AuthLoginRO, JwtPayload} from './interfaces';
import {UserEntity} from '../users/user.entity';
import {UserRO} from '../users/interfaces';

@Injectable()
export class AuthService {

  private logger: Logger;

  constructor(private readonly usersService: UsersService,
              private readonly jwtService: JwtService) {
    this.logger = new Logger('AuthService');
    this.logger.log('constructor()');
  }

  async validateUser(username: string, password: string): Promise<UserRO | null> {
    let userRO: UserRO | null = null;
    this.logger.log(`validateUser(username='${username}',password='${password}')`);
    const userEntity: UserEntity = await this.usersService.findOneUsername(username);
    if (userEntity && await userEntity.comparePassword(password)) {
      userRO = userEntity.toResponseObject();
    }
    this.logger.log(`validateUser(username='${username}',password='${password}') => ${userRO ? 'OK' : 'NOK'}`);
    return userRO;
  }

  async login(user: UserEntity): Promise<AuthLoginRO> {
    const payload: JwtPayload = {id: user.id, username: user.username, role: user.role};
    const authLoginRO: AuthLoginRO = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      token: this.jwtService.sign(payload)
    };
    this.logger.log(`login(user='${JSON.stringify(user)}') => authLoginRO='${JSON.stringify(authLoginRO)}'`);
    return authLoginRO;
  }
}
