import { BaseEntity as _BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseEntity extends _BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiPropertyOptional()
  id: string;

  @CreateDateColumn()
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  created: Date;

  @UpdateDateColumn()
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  updated: Date;
}
