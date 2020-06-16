import {Injectable, Logger} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';

import {configuration} from '../../config';
import {AuthService} from '../auth.service';

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
  }

  async validate(payload: any) {
    const result = {id: payload.sub, username: payload.username};
    this.logger.log(`validate(payload='${JSON.stringify(payload)}') => result='${JSON.stringify(result)}'`);
    return result;
  }
}
