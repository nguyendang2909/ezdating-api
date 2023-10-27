import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import _ from 'lodash';

import { ClientData } from '../../modules/auth/auth.type';
import { PaginatedResponse, Pagination } from '../../types';
import { HttpErrorMessages } from '../erros/http-error-messages.constant';
import { DbService } from './db.service';

export class ApiService extends DbService {
  async findMany(
    queryParams: Record<string, any>,
    client: ClientData,
  ): Promise<PaginatedResponse<Record<string, any>>> {
    throw new InternalServerErrorException(
      HttpErrorMessages['Not implemented'],
    );
  }

  public getPagination(data: unknown[]): Pagination {
    throw new InternalServerErrorException(
      HttpErrorMessages['Not implemented'],
    );
  }

  public getPaginationByField<T>(
    data: T[],
    field: keyof T | (keyof T)[],
  ): Pagination {
    const dataLength = data.length;
    if (!dataLength || dataLength < this.limitRecordsPerQuery) {
      return { _next: null };
    }
    const lastData = data[dataLength - 1];
    if (_.isArray(field)) {
      if (!field.length) {
        return {
          _next: null,
        };
      }
      const obj: Partial<T> = {};
      for (const item of field) {
        obj[item] = lastData[item];
      }

      return {
        _next: this.encodeFromObj(obj),
      };
    }
    const lastField = lastData[field]?.toString();

    return {
      _next: lastField ? this.encodeFromString(lastField) : null,
    };
  }

  public encodeFromString(value: string): string {
    return Buffer.from(value, 'utf-8').toString('base64');
  }

  public encodeFromObj(value: Record<string, any>): string {
    return this.encodeFromString(JSON.stringify(value));
  }

  public decodeToString(value: string): string {
    return Buffer.from(value, 'base64').toString('utf-8');
  }

  public decodeToObj<T extends Record<string, any>>(value: string): T {
    const decoded = this.decodeToString(value);

    try {
      const obj = JSON.parse(decoded) as T;

      if (!_.isObject(obj)) {
        throw new BadRequestException(
          HttpErrorMessages['Input data was not correct'],
        );
      }

      return obj;
    } catch (err) {
      throw new BadRequestException(
        HttpErrorMessages['Input data was not correct'],
      );
    }
  }

  protected getCursor(_cursor: string): any {
    const cursor = this.decodeToString(_cursor);

    return cursor;
  }
}
