import {Controller, Get, Logger, Param} from '@nestjs/common';
import {ApiTags, ApiBearerAuth} from '@nestjs/swagger';

import {UserService} from './user.service';
import {UserRO} from './interfaces';
import {AuthService} from '../auth/auth.service';

@Controller()
export class UserController {

  private logger: Logger;

  constructor(private userService: UserService) {
    this.logger = new Logger('userService');
    this.logger.log('constructor()');
  }

  @Get('users')
  @ApiTags('users')
  @ApiBearerAuth()
  findAll() {
    this.logger.log('findAll()');
    return this.userService.findAll();
  }

  @Get('users/:id')
  @ApiTags('users')
  @ApiBearerAuth()
  findOne(@Param('id') id: string): Promise<UserRO> {
    this.logger.log('findOne()');
    return this.userService.findOne(id);
  }
}
