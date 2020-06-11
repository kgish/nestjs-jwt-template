import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

import {AuthLoginDto} from './dto';
import {UserService} from '../user/user.service';
import {AuthLoginRO} from './interfaces';
import {UserEntity} from '../user/user.entity';
import {UserRO} from '../user/interfaces';

@Injectable()
export class AuthService {

  logger: Logger;

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

  async login(authLoginDto: AuthLoginDto): Promise<AuthLoginRO> {
    const username = authLoginDto.username;
    const pass = authLoginDto.password;
    this.logger.log(`login(username='${username}',password='${pass}')`);

    const userEntity = await this.userService.findOneUsername(username);

    if (!userEntity || (!await userEntity.comparePassword(authLoginDto.password))) {
      this.logger.log(`login(username='${username}',password='${pass}') => 400 Invalid credentials}`);
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, salt, ...userRO} = userEntity;
    const authLoginRO = {
      user: userRO,
      token: this.jwtService.sign(userRO),
    };
    this.logger.log(`login(username='${username}',password='${pass}') => authLoginRO='${JSON.stringify(authLoginRO)}'}`);
    return authLoginRO;
  }
}
