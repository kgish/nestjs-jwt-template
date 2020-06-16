import {Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

import {UsersService} from './users.service';
import {Role, UserRO} from './interfaces';
import {Roles,RolesGuard,ValidationPipe} from '../shared';
import {JwtAuthGuard} from '../auth/guards';
import {UserEntity} from './user.entity';
import {GetOperationId} from '../shared';
import {ApiException} from '../shared/api-exception';
import {UserDto} from './dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {

  private logger: Logger;

  constructor(private usersService: UsersService) {
    this.logger = new Logger('usersController');
  }

  @Post()
  @Roles(Role.admin)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({type: UserEntity})
  @ApiBadRequestResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(UserEntity.modelName, 'Create'))
  create(@Body() data: UserDto): Promise<UserRO> {
    this.logger.log(`POST create(data='${JSON.stringify(data)}')`);
    return this.usersService.create(data);
  }

  @Get()
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @ApiOkResponse({type: UserEntity, isArray: true})
  @ApiBadRequestResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(UserEntity.modelName, 'GetAll'))
  findAll(): Promise<UserRO[]> {
    this.logger.log('GET findAll()');
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({type: UserEntity})
  @ApiBadRequestResponse({type: ApiException})
  @ApiNotFoundResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(UserEntity.modelName, 'GetOne'))
  findOne(@Param('id') id: string): Promise<UserRO> {
    this.logger.log(`GET findOne(id='${id}')`);
    return this.usersService.findOne(id);
  }

  @Put()
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({type: UserEntity})
  @ApiBadRequestResponse({type: ApiException})
  @ApiNotFoundResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(UserEntity.modelName, 'Update'))
  update(@Param('id') id: string, @Body() data: Partial<UserDto>): Promise<UserRO> {
    this.logger.log(`PUT update(id='${id}',data='${JSON.stringify(data)}')`);
    return this.usersService.update(id, data);
  }

  @Delete()
  @Roles(Role.admin)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({type: UserEntity})
  @ApiBadRequestResponse({type: ApiException})
  @ApiNotFoundResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(UserEntity.modelName, 'Delete'))
  delete(@Param('id') id: string): Promise<UserRO> {
    this.logger.log(`DELETE delete(id='${id}')`);
    return this.usersService.delete(id);
  }
}
