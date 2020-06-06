import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpStatus,
  CallHandler,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle()
      .pipe(
        catchError(err =>
          throwError(new HttpException(JSON.stringify(err), HttpStatus.BAD_GATEWAY)),
        ),
      );
  }
}
