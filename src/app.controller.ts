import {Controller, Get, Logger} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('root')
@Controller()
export class AppController {
  private logger: Logger;

  constructor(private readonly appService: AppService) {
    this.logger = new Logger('AppController');
    this.logger.log('constructor()');
  }

  @Get()
  healthCheck(): string {
    this.logger.log('healthCheck()');
    return this.appService.healthCheck();
  }
}
