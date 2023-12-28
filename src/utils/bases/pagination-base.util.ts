import _ from 'lodash';

import { Pagination } from '../../types';

export class PaginationBaseUtil {
  public getCursor(_cursor: string): any {
    return this.decode(_cursor);
  }

  public decode(e: string) {
    return Buffer.from(e, 'base64').toString('utf-8');
  }

  public encodeCursor(e: string) {
    return this.encodeFromString(e);
  }

  public getPaginationByField<T>(
    data: T[],
    field: keyof T | (keyof T)[],
    limitRecordsPerQuery: number,
  ): Pagination {
    const dataLength = data.length;
    if (!dataLength || dataLength < limitRecordsPerQuery) {
      return { _next: null };
    }
    const lastData = data[dataLength - 1];
    if (_.isArray(field)) {
      return {
        _next: field.length
          ? this.encodeFromObj(_.pick(lastData, field))
          : null,
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
}
