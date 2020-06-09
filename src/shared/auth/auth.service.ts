import {Injectable, Logger} from '@nestjs/common';
import {sign, SignOptions} from 'jsonwebtoken';

import {JwtPayload} from './interfaces/jwt-payload.interface';
// TODO import {UserService} from '../../user/user.service';
import {Role, UserRO} from '../../user/interfaces';

import { configuration } from '../../config/configuration';
const config = configuration();

@Injectable()
export class AuthService {

  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;

  private logger: Logger;

  constructor() {
    this.logger = new Logger('AuthService');
    this.jwtOptions = {expiresIn: config.auth.jwt.expiresIn};
    this.jwtKey = config.auth.jwt.secret;
    this.logger.log(`constructor() ${JSON.stringify({jwtKey: this.jwtKey, jwtOptions: this.jwtOptions})}`);
  }

  // TODO
  async validateUser(payload: JwtPayload): Promise<UserRO> {
    // const result = this.userService.findOneUsername(payload.username);
    const result = {
      id: '1',
      username: 'kgish',
      name: 'Kiffin Gish',
      role: Role.admin,
      created: new Date(),
      updated: new Date()
    };
    this.logger.log(`validateUser() payload='${JSON.stringify(payload)}' => ${JSON.stringify(result)}`);
    return new Promise(() => result);
  }

  async signPayload(payload: JwtPayload): Promise<string> {
    const result = sign(payload, this.jwtKey, this.jwtOptions);
    this.logger.log(`signPayload() payload='${JSON.stringify(payload)}' => ${result}`);
    return result;
  }
}
