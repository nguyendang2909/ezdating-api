import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface Response<T> {
    data: T;
}
export declare class CustomReturnFieldsInterceptor<T> implements NestInterceptor<T, Response<T>> {
    logger: Logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>;
}
