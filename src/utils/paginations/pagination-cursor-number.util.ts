import { Injectable } from '@nestjs/common';

import { PaginationBaseUtil } from '../bases/pagination-base.util';

@Injectable()
export class PaginationCursorNumberUtil extends PaginationBaseUtil {
  public getCursor(_cursor: string): number {
    const cursor = this.decode(_cursor);
    return +cursor;
  }
}
