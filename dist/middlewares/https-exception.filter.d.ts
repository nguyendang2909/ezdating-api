import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): Promise<void>;
    prepareException(exc: any): Promise<{
        json: Record<any, any>;
        status: number;
    }>;
}
