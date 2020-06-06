import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OperatorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
}
