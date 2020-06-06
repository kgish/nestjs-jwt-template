import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    res.headers.append('Access-Control-Allow-Origin', '*');
    res.headers.append('Access-Control-Allow-Methods', '*');
    next();
  }
}
