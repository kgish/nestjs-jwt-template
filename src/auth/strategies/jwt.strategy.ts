import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';

import {configuration} from '../../config/configuration';
import {UserRO} from "../../user/interfaces";
import {AuthService} from "../auth.service";

const config = configuration();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger: Logger;

  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.jwt.secret,
    });
    this.logger = new Logger('JwtStrategy');
    this.logger.log('constructor()');
  }

  async validate(payload: any) {
    const result = {id: payload.sub, username: payload.username};
    this.logger.log(`validate(payload='${JSON.stringify(payload)}') => result='${JSON.stringify(result)}'`);
    return result;
  }

  // async validate(username: string, password: string): Promise<UserRO> {
  //   this.logger.log(`validate(username='${JSON.stringify(username)}',password='${password}')`);
  //   const userRO = await this.authService.validateUser(username, password);
  //   if (!userRO) {
  //     this.logger.log(`validate(username='${username}',password='${password}') => UnauthorizedException`);
  //     throw new UnauthorizedException();
  //   }
  //   this.logger.log(`validate(username='${username}',password='${password}') => userRO='${JSON.stringify(userRO)}'`);
  //   return userRO;
  // }
}
