import {Reflector} from '@nestjs/core';
import {Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger} from '@nestjs/common';

import {Role} from '../../users';

import { configuration } from '../../config';
const config = configuration();

@Injectable()
export class RolesGuard implements CanActivate {

  private logger: Logger;
  private readonly enabled: boolean;

  constructor(private readonly reflector: Reflector ) {
    this.logger = new Logger('RolesGuard');
    this.enabled = config.auth.enabled;
    // this.logger.log(`constructor() enabled='${this.enabled}'`);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!this.enabled) {
      this.logger.log(`canActivate() authEnabled='false' => true`);
      return true;
    }

    if (!roles || roles.length === 0) {
      this.logger.log(`canActivate() roles='${JSON.stringify(roles)}' => true`);
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.role && roles.indexOf(user.role) !== -1) {
      this.logger.log(`canActivate() user='${JSON.stringify(user)}', roles='${JSON.stringify(roles)}' => true`);
      return true;
    }

    this.logger.log(`canActivate() user='${JSON.stringify(user)}', roles='${JSON.stringify(roles)}' => UNAUTHORIZED`);
    throw new HttpException('You do not have permission (roles)', HttpStatus.UNAUTHORIZED);
  }
}
