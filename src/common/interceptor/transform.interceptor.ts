import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
    statusCode: number;
    message: string;
    error: string;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        return next.handle().pipe(
            map(data => ({
                statusCode,
                message: statusCode >= 400 ? response.message || 'Error' : 'Success',
                error: statusCode >= 400 ? response.error : null,
                data,
            })),

            catchError(err => {
                console.log('[ERROR] : ', err)
                const statusCode = err instanceof HttpException ? err.getStatus() : 500;
                const errorResponse = {
                    statusCode,
                    message: 'Internal server error',
                    error: 'Error',
                    ...(err.response || {}),
                };

                return throwError(() => new HttpException(errorResponse, statusCode));
            })
        );
    }
} 