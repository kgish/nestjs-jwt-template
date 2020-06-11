import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-local';

import {UserRO} from '../../user/interfaces';
import {AuthService} from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger: Logger;

  constructor(private readonly authService: AuthService) {
    super();
    this.logger = new Logger('LocalStrategy');
    this.logger.log('constructor()');
  }

  async validate(username: string, password: string): Promise<UserRO> {
    this.logger.log(`validate(username='${username}',password='${password}')`);
    const userRO = await this.authService.validateUser(username, password);
    if (!userRO) {
      this.logger.log(`validate(username='${username}',password='${password}') => UnauthorizedException`);
      throw new UnauthorizedException();
    }
    this.logger.log(`validate(username='${username}',password='${password}') => userRO='${JSON.stringify(userRO)}'`);
    return userRO;
  }
}
