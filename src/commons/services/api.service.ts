import { InternalServerErrorException } from '@nestjs/common';
import _ from 'lodash';

import { HttpErrorMessages } from '../erros/http-error-messages.constant';
import { Pagination } from '../types';
import { DbService } from './db.service';

export class ApiService extends DbService {
  public getPagination(data: any[]): Pagination {
    throw new InternalServerErrorException(
      HttpErrorMessages['Not implemented!'],
    );
  }

  public getPaginationByField(
    data: any[],
    field: string | string[],
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
      const obj: Record<string, any> = {};
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

  public encodeFromString(value?: string): string | null {
    if (!value) {
      return null;
    }

    return Buffer.from(value, 'utf-8').toString('base64');
  }

  public encodeFromObj(value?: Record<string, any>): string | null {
    if (!value || _.isEmpty(value)) {
      return null;
    }

    return this.encodeFromString(JSON.stringify(value));
  }

  public decodeToString(value?: string | null): string | undefined {
    if (!value) {
      return undefined;
    }

    return Buffer.from(value, 'base64').toString('utf-8');
  }

  public decodeToObj<T extends Record<string, any>>(
    value?: string,
  ): T | undefined {
    const decoded = this.decodeToString(value);

    if (!decoded) {
      return undefined;
    }

    try {
      const obj = JSON.parse(decoded) as T;

      return _.isEmpty(obj) ? undefined : obj;
    } catch (err) {
      return undefined;
    }
  }
}
