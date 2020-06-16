import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put, UseGuards,
  UsePipes,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import {PostsService} from './posts.service';

import {ValidationPipe} from '../shared/pipes/validation.pipe';
import {GetOperationId} from '../shared/utilities/get-operation-id';
import {ApiException} from '../shared/api-exception';
import {Roles} from '../shared/decorators/roles.decorator';
import {Role} from '../users/interfaces';
import {RolesGuard} from '../shared/guards/roles.guard';
import {JwtAuthGuard} from '../auth/guards';
import {PostEntity} from "./post.entity";
import {PostDto} from "./dto";
import {PostRO} from "./interfaces";

@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
export class PostsController {

  private logger: Logger;

  constructor(private postsService: PostsService) {
    this.logger = new Logger('PostsController');
    this.logger.log('constructor()');
  }

  @Post()
  @Roles(Role.admin)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({type: PostEntity})
  @ApiBadRequestResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(PostEntity.modelName, 'Create'))
  create(@Body() data: PostDto): Promise<PostRO> {
    this.logger.log(`POST create(data='${JSON.stringify(data)}')`);
    const result = this.postsService.create(data);
    this.logger.log(`POST create(data='${JSON.stringify(data)}') => result='${JSON.stringify(result)}'`);
    return result;
  }

  @Get()
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @ApiOkResponse({type: PostEntity, isArray: true})
  @ApiBadRequestResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(PostEntity.modelName, 'GetAll'))
  findAll(): Promise<PostRO[]> {
    this.logger.log('GET findAll()');
    const result = this.postsService.findAll();
    this.logger.log(`GET findAll() => result='${JSON.stringify(result)}'`);
    return result;
  }

  @Get(':id')
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @ApiOkResponse({type: PostEntity})
  @ApiBadRequestResponse({type: ApiException})
  @ApiNotFoundResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(PostEntity.modelName, 'GetOne'))
  findOne(@Param('id') id: string): Promise<PostRO> {
    this.logger.log(`GET findOne(id='${id}')`);
    const result = this.postsService.findOne(id);
    this.logger.log(`GET findOne(id='${id}') result='${JSON.stringify(result)}'`);
    return result;
  }

  @Put()
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({type: PostEntity})
  @ApiBadRequestResponse({type: ApiException})
  @ApiNotFoundResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(PostEntity.modelName, 'Update'))
  update(@Param('id') id: string, @Body() data: Partial<PostDto>): Promise<PostRO> {
    this.logger.log(`PUT update(id='${id}',data='${JSON.stringify(data)}')`);
    const result = this.postsService.update(id, data);
    this.logger.log(`PUT update(id='${id}',data='${JSON.stringify(data)}') result='${JSON.stringify(result)}'`);
    return result;
  }

  @Delete()
  @Roles(Role.admin)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @ApiOkResponse({type: PostEntity})
  @ApiBadRequestResponse({type: ApiException})
  @ApiNotFoundResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(PostEntity.modelName, 'Delete'))
  delete(@Param('id') id: string): Promise<PostRO> {
    this.logger.log(`DELETE delete(id='${id}')`);
    const result = this.postsService.delete(id);
    this.logger.log(`DELETE delete(id='${id}') result='${JSON.stringify(result)}'`);
    return result;
  }
}
