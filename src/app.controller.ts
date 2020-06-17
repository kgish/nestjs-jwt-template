import {Body, Controller, Get, Logger, Post, Request, UseGuards, UsePipes} from '@nestjs/common';
import {ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from '@nestjs/swagger';

import {AuthService} from './auth/auth.service';
import {JwtAuthGuard, LocalAuthGuard} from './auth/guards';
import {UsersService} from './users/users.service';
import {AuthLoginRO} from './auth/interfaces';

import {AppService} from './app.service';
import {ValidationPipe} from "./shared/pipes";
import {ApiException} from "./shared/api-exception";
import {GetOperationId} from "./shared/utilities";
import {UserEntity} from "./users/user.entity";
import {UserCreateDto, UserDto, UserLoginDto, UserRegisterDto} from "./users/dto";
import {Role, UserRO} from "./users/interfaces";

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
  @ApiTags('root')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ type: String })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(UserEntity.modelName, 'healthCheck'))
  healthCheck(): string {
    this.logger.log('healthCheck()');
    return this.appService.healthCheck();
  }

  @UseGuards(LocalAuthGuard)
  @Post('register')
  @ApiTags('auth')
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ type: UserRegisterDto })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(UserEntity.modelName, 'Register'))
  register(@Body() data: UserRegisterDto): Promise<UserRO> {
    const userCreateDto: UserCreateDto = {
      username: data.username,
      name: data.name,
      role: Role.user,
      password: data.password
    };
    return this.usersService.create(userCreateDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiTags('auth')
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ type: UserLoginDto })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(UserEntity.modelName, 'Login'))
  async login(@Request() req): Promise<AuthLoginRO> {
    this.logger.log('login()');
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiTags('user')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ type: UserRO})
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation(GetOperationId(UserEntity.modelName, 'Profile'))
  async profile(@Request() req): Promise<UserRO> {
    this.logger.log('profile()');
    const userEntity = await this.usersService.findOneUsername(req.user.username);
    return userEntity.toResponseObject();
  }
}
