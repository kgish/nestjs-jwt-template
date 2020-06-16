import {ExecutionContext, Injectable, Logger} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private logger: Logger;

  constructor() {
    super();
    this.logger = new Logger('LocalAuthGuard');
  }

  canActivate(context: ExecutionContext) {
    // const request = context.switchToHttp().getRequest();
    const result = super.canActivate(context);
    this.logger.log(`canActivate() => ${result ? 'OK' : 'NOK'}`);
    return result;
  }
}
