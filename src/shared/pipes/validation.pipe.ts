import {HttpException, HttpStatus, Logger} from '@nestjs/common';
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import {validate} from 'class-validator';
import {plainToClass} from 'class-transformer';

import {isUuid} from "uuidv4";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  logger: Logger;

  constructor() {
    this.logger = new Logger('ValidationPipe');
    this.logger.log('constructor()');
  }

  async transform(value: any, metadata: ArgumentMetadata) {

    // this.logger.log(`transform(value='${JSON.stringify(value)}',metadata='${JSON.stringify(metadata)}')`);

    if (value instanceof Object && this.isEmpty(value)) {
      this.logger.log(`transform(value='${JSON.stringify(value)}',metadata='${JSON.stringify(metadata)}') => HTTP Exception BAD_REQUEST (empty body)`);
      throw new HttpException('Validation failed: empty body', HttpStatus.BAD_REQUEST);
    }

    if (metadata.type === 'param' && metadata.data === 'id' && typeof(value) === 'string') {
      // Check that the id is a valid uuid.
      if (!isUuid(value)){
        this.logger.log(`transform(value='${JSON.stringify(value)}',metadata='${JSON.stringify(metadata)}') => HTTP Exception NOT_FOUND (invalid uuid='${value}')`);
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
    }
    const {metatype} = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      this.logger.log(`transform(value='${JSON.stringify(value)}',metadata='${JSON.stringify(metadata)}') => '${JSON.stringify(value)}'`);
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      this.logger.log(`transform(value='${JSON.stringify(value)}',metadata='${JSON.stringify(metadata)}') => HTTP Exception BAD_REQUEST (${formattedErrors})`);
      throw new HttpException(`Validation failed: ${formattedErrors}`, HttpStatus.BAD_REQUEST);
    }

    this.logger.log(`transform(value='${JSON.stringify(value)}',metadata='${JSON.stringify(metadata)}') => '${JSON.stringify(value)}'`);
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }

  private formatErrors(errors: any[]): string {
    return errors.map(err => {
      const constraints = err.constraints;
      for (const property in constraints) {
        if (constraints.hasOwnProperty(property)) {
          return constraints[property];
        }
      }
    }).join(', ');
  }

  private isEmpty(value: any): boolean {
    return !(value && Object.keys(value).length > 0);
  }
}
