import { InternalServerErrorException } from '@nestjs/common';

import { APP_CONFIG } from '../../../app.config';
import { ClientData } from '../../../modules/auth/auth.type';
import { Pagination } from '../../../types';
import { ERROR_MESSAGES } from '../../messages';
import { ApiBaseService } from './api.base.service';

export class ApiReadService<
  Entity extends object,
  QueryParams = Record<string, any>,
> extends ApiBaseService {
  protected limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.DEFAULT;

  public async findOneById(id: string, client: ClientData): Promise<Entity> {
    return await this.throwNotImplemented();
  }

  public async findMany(
    queryParams: QueryParams,
    client: ClientData | undefined,
  ): Promise<Entity[]> {
    return await this.throwNotImplemented();
  }

  public getPagination(data: unknown[]): Pagination {
    throw new InternalServerErrorException(ERROR_MESSAGES['Not implemented']);
  }

  // public getPaginationByField<T>(
  //   data: T[],
  //   field: keyof T | (keyof T)[],
  // ): Pagination {
  //   return this.paginationUtil.getPaginationByField(
  //     data,
  //     field,
  //     this.limitRecordsPerQuery,
  //   );
  // }

  // public decodeToString(value: string): string {
  //   return Buffer.from(value, 'base64').toString('utf-8');
  // }

  // public decodeToObj<T extends Record<string, any>>(value: string): T {
  //   const decoded = this.decodeToString(value);
  //   try {
  //     const obj = JSON.parse(decoded) as T;
  //     if (!_.isObject(obj)) {
  //       throw new BadRequestException(
  //         ERROR_MESSAGES['Input data was not correct'],
  //       );
  //     }
  //     return obj;
  //   } catch (err) {
  //     throw new BadRequestException(
  //       ERROR_MESSAGES['Input data was not correct'],
  //     );
  //   }
  // }
}
