import {IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {UserDto} from "./user.dto";

// User create data transfer object
export class UserCreateDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
