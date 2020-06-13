import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

import {AuthLoginDto} from './dto';
import {UserService} from '../user/user.service';
import {AuthLoginRO, JwtPayload} from './interfaces';
import {UserEntity} from '../user/user.entity';
import {Role, UserRO} from '../user/interfaces';

@Injectable()
export class AuthService {

  private logger: Logger;

  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService) {
    this.logger = new Logger('AuthService');
    this.logger.log('constructor()');
  }

  async validateUser(username: string, password: string): Promise<UserRO | null> {
    let userRO: UserRO | null = null;
    this.logger.log(`validateUser(username='${username}',password='${password}')`);
    const userEntity: UserEntity = await this.userService.findOneUsername(username);
    if (userEntity && await userEntity.comparePassword(password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {password, salt, ...userRO_} = userEntity;
      userRO = userRO_;
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
