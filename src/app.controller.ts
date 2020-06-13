import {Controller, Get, Logger, Post, Request, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {AuthService} from './auth/auth.service';
import {JwtAuthGuard, LocalAuthGuard} from './auth/guards';
import {UserService} from "./user/user.service";
import {UserRO} from "./user/interfaces";
import {AuthLoginRO} from "./auth/interfaces";

import {AppService} from './app.service';

@ApiTags('root')
@Controller()
export class AppController {
  private logger: Logger;

  constructor(private readonly appService: AppService,
              private readonly userService: UserService,
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
  @Post('login')
  async login(@Request() req): Promise<AuthLoginRO> {
    this.logger.log('login()');
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req): Promise<UserRO> {
    this.logger.log('profile()');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, salt, posts, ...userRO} = await this.userService.findOneUsername(req.user.username);
    return userRO;
  }
}
