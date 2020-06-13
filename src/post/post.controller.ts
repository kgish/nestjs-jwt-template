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

import {PostService} from './post.service';

import {ValidationPipe} from '../shared/pipes/validation.pipe';
import {GetOperationId} from '../shared/utilities/get-operation-id';
import {ApiException} from '../shared/api-exception';
import {Roles} from '../shared/decorators/roles.decorator';
import {Role} from '../user/interfaces';
import {RolesGuard} from '../shared/guards/roles.guard';
import {JwtAuthGuard} from '../auth/guards';
import {PostEntity} from "./post.entity";
import {PostDto} from "./dto";
import {PostRO} from "./interfaces";

@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
export class PostController {

  private logger: Logger;

  constructor(private postService: PostService) {
    this.logger = new Logger('PostController');
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
    this.logger.log(JSON.stringify(data));
    return this.postService.create(data);
  }

  @Get()
  @Roles(Role.admin, Role.editor)
  @UseGuards(new JwtAuthGuard(), RolesGuard)
  @ApiOkResponse({type: PostEntity, isArray: true})
  @ApiBadRequestResponse({type: ApiException})
  @ApiForbiddenResponse({type: ApiException})
  @ApiOperation(GetOperationId(PostEntity.modelName, 'GetAll'))
  findAll(): Promise<PostRO[]> {
    return this.postService.findAll();
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
    return this.postService.findOne(id);
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
    this.logger.log(JSON.stringify(data));
    return this.postService.update(id, data);
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
    return this.postService.delete(id);
  }
}
