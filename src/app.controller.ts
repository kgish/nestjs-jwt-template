import {Body, Controller, Get, Logger, Post, Request, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {AuthService} from './auth/auth.service';

import {AppService} from './app.service';
import {JwtAuthGuard, LocalAuthGuard} from './auth/guards';

@ApiTags('root')
@Controller()
export class AppController {
  private logger: Logger;

  constructor(private readonly appService: AppService,
              private readonly authService: AuthService) {
    this.logger = new Logger('AppController');
    this.logger.log('constructor()');
  }

  @Get()
  healthCheck(): string {
    this.logger.log('healthCheck()');
    return this.appService.healthCheck();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() body) {
    this.logger.log(`login() body='${JSON.stringify(body)}'`);
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
