import _ from 'lodash';
import { Types } from 'mongoose';

import {
  GetCursors,
  PaginationCursors,
} from '../../commons/constants/paginations';

export class CommonModel {
  public areObjectIdEqual(
    first: Types.ObjectId,
    second: Types.ObjectId,
  ): boolean {
    return first.toString() === second.toString();
  }

  public getObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  public encodeCursor(str: string): string {
    return Buffer.from(str, 'utf-8').toString('base64');
  }

  public extractCursor(value?: string): string | undefined {
    if (!value) {
      return;
    }
    return Buffer.from(value, 'base64').toString('utf-8');
  }

  public getCursors({ next, prev }: GetCursors): PaginationCursors {
    return {
      next: !_.isNil(next) ? this.encodeCursor(next) : null,
      prev: !_.isNil(prev) ? this.encodeCursor(prev) : null,
    };
  }
}
