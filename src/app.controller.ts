import {Controller, Get, Logger, Post, Request, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {AuthService} from './auth/auth.service';
import {JwtAuthGuard, LocalAuthGuard} from './auth/guards';
import {UsersService} from './users/users.service';
import {UserRO} from './users/interfaces';
import {AuthLoginRO} from './auth/interfaces';

import {AppService} from './app.service';

@ApiTags('root')
@Controller()
export class AppController {
  private logger: Logger;

  constructor(private readonly appService: AppService,
              private readonly usersService: UsersService,
              private readonly authService: AuthService) {
    this.logger = new Logger('AppController');
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
    const userEntity = await this.usersService.findOneUsername(req.user.username);
    return userEntity.toResponseObject();
  }
}
