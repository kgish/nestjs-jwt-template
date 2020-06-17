import { UserBaseDto } from './user-base.dto';
import {IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UserRegisterDto extends UserBaseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
}
