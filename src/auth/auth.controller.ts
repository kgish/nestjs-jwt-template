import {Body, Controller, Logger, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags} from '@nestjs/swagger';

import {AuthService} from './auth.service';
import {ApiException} from '../shared/api-exception';
import {GetOperationId} from '../shared/utilities/get-operation-id';
import {UserEntity} from '../user/user.entity';
import {AuthLoginDto} from './dto';
import {AuthLoginRO} from './interfaces';

@ApiTags('auth')
@Controller()
export class AuthController {
  private logger: Logger;

  constructor(private readonly authService: AuthService) {
    this.logger = new Logger('AuthController');
    this.logger.log('constructor()');
  }

  @Post('login')
  // @ApiTags('auth')
  // @UsePipes(new ValidationPipe())
  // @ApiCreatedResponse({type: AuthLoginDto})
  // @ApiBadRequestResponse({type: ApiException})
  // @ApiOperation(GetOperationId(UserEntity.modelName, 'Login'))
  login(@Body() data: AuthLoginDto): Promise<AuthLoginRO> {
    this.logger.log(`login(username='${data.username}')`);
    const result = this.authService.login(data);
    this.logger.log(`login(username='${data.username}') => ${result ? 'OK' : 'NOK'}`);
    return result;
  }
}
