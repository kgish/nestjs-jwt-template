import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { configuration } from '../../../config/configuration';
const config = configuration();

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  private enabled: boolean;
  private logger: Logger;

  constructor() {
    super();
    this.logger = new Logger('JwtAuthGuard');
    this.enabled = config.auth.enabled;
    this.logger.log(`constructor() enabled='${this.enabled}'`);
  }

  canActivate(context: ExecutionContext) {
    const result = this.enabled ? super.canActivate(context) : true;
    this.logger.log(`canActivate() => result='${result}'`);
    return result;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      const parms = [];
      if (err) {
        parms.push(`err='${err}'`);
      }
      if (user) {
        parms.push(`user='${JSON.stringify(user)}'`);
      }
      if (info) {
        parms.push(`info='${info}'`);
      }
      this.logger.error(`handleRequest() ${parms.join(', ')}`);
      throw err || new UnauthorizedException();
    }
    this.logger.log(`handleRequest() => '${JSON.stringify(user)}'`);
    return user;
  }
}
