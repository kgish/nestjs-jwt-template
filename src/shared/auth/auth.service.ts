import { Injectable, Logger } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../../user/user.service';
import { Role, UserRO } from '../../user/interfaces';

@Injectable()
export class AuthService {

  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;

  logger: Logger;

  // constructor(private readonly userService: UserService) {
  constructor() {
    this.logger = new Logger('AuthService');
    this.jwtOptions = { expiresIn: process.env.JWT_EXPIRES || '30m' };
    this.jwtKey = process.env.JWT_SECRET || 'secret';
    this.logger.log(`constructor() ${ JSON.stringify({ jwtKey: this.jwtKey, jwtOptions: this.jwtOptions }) }`);
  }

  async createToken() {
    const payload: JwtPayload = { username: 'zappb', name: 'Zapp Brannigan', role: Role.user };
    const expiresIn = this.jwtOptions.expiresIn;
    const accessToken = sign(payload, this.jwtKey, this.jwtOptions);
    const result = { expiresIn, accessToken };
    this.logger.log(`createToken() payload='${ JSON.stringify(payload) }' => ${ result }`);
    return result;
  }

  // TODO
  async validateUser(payload: JwtPayload): Promise<UserRO> {
    // const result = this.userService.findOneUsername(payload.username);
    const result = { id: '1', username: 'kgish', name: 'Kiffin Gish', role: Role.admin, created: new Date(), updated: new Date()  };
    this.logger.log(`validateUser() payload='${ JSON.stringify(payload) }' => ${ JSON.stringify(result) }`);
    return new Promise((resolve) => result);
  }

  async signPayload(payload: JwtPayload): Promise<string> {
    const result = sign(payload, this.jwtKey, this.jwtOptions);
    this.logger.log(`signPayload() payload='${ JSON.stringify(payload) }' => ${ result }`);
    return result;
  }
}
