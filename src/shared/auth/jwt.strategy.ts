import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

import { configuration } from '../../config/configuration';
const config = configuration();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  private logger: Logger;

  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.jwt.secret,
    });
    this.logger = new Logger('JwtStrategy');
    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    const secretOrKey = config.auth.jwt.secret;
    this.logger.log(`constructor() ${JSON.stringify({ jwtFromRequest, secretOrKey })}`);
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);
    this.logger.log(`validate() payload='${JSON.stringify(payload)}', user='${JSON.stringify(user)}'`);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
