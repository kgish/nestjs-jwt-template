import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  private logger: Logger;

  constructor() {
    this.logger = new Logger('LoggerMiddleware');
    this.logger.log('constructor()');
  }

  use(req: Request, res: Response, next: Function) {
    this.logger.log(`req='${JSON.stringify(req)}' res='${JSON.stringify(res)}'`);
    next();
  }
}
