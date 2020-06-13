import {Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOperation, ApiOkResponse, ApiNotFoundResponse
} from '@nestjs/swagger';

import {UserService} from './user.service';
import {Role, UserRO} from './interfaces';
import {Roles} from '../shared/decorators/roles.decorator';
import {JwtAuthGuard} from '../auth/guards';
import {RolesGuard} from '../shared/guards/roles.guard';
import {ValidationPipe} from '../shared/pipes/validation.pipe';
import {UserEntity} from './user.entity';
import {ApiException} from '../shared/api-exception';
import {GetOperationId} from '../shared/utilities/get-operation-id';
import {UserDto} from "./dto";

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {

  private logger: Logger;

  constructor(private userService: UserService) {
    this.logger = new Logger('userService');
    this.logger.log('constructor()');
  }

  @Post()
  @Roles(Role.admin)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ type: UserEntity })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiForbiddenResponse({ type: ApiException })
  @ApiOperation(GetOperationId(UserEntity.modelName, 'Create'))
  create(@Body() data: UserDto): Promise<UserRO> {
    this.logger.log(JSON.stringify(data));
    return this.userService.create(data);
  }

  @Get()
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiForbiddenResponse({ type: ApiException })
  @ApiOperation(GetOperationId(UserEntity.modelName, 'GetAll'))
  findAll(): Promise<UserRO[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiNotFoundResponse({ type: ApiException })
  @ApiForbiddenResponse({ type: ApiException })
  @ApiOperation(GetOperationId(UserEntity.modelName, 'GetOne'))
  findOne(@Param('id') id: string): Promise<UserRO> {
    return this.userService.findOne(id);
  }

  @Put()
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiNotFoundResponse({ type: ApiException })
  @ApiForbiddenResponse({ type: ApiException })
  @ApiOperation(GetOperationId(UserEntity.modelName, 'Update'))
  update(@Param('id') id: string, @Body() data: Partial<UserDto>): Promise<UserRO> {
    this.logger.log(JSON.stringify(data));
    return this.userService.update(id, data);
  }

  @Delete()
  @Roles(Role.admin)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiNotFoundResponse({ type: ApiException })
  @ApiForbiddenResponse({ type: ApiException })
  @ApiOperation(GetOperationId(UserEntity.modelName, 'Delete'))
  delete(@Param('id') id: string): Promise<UserRO> {
    return this.userService.delete(id);
  }
}
