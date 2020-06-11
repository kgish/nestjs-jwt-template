import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AuthLoginRO} from '../interfaces/auth-login-ro.interface';

import {configuration} from '../../config/configuration';

const config = configuration();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.jwt.secret,
    });
  }

  async validate(payload: AuthLoginRO) {
    return {id: payload.user.id, username: payload.user.username};
  }
}
