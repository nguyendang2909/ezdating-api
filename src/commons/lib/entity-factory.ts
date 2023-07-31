import _ from 'lodash';

import {
  Cursors,
  GetCursors,
  PaginationCursors,
} from '../constants/paginations';
import { ExtractCursor } from '../types';

export class EntityFactory {
  // public static getEntityName(Entity: Record<string, any>): string {
  //   const EntityName = Entity.name;

  //   return EntityName[0].toLowerCase() + EntityName.slice(1);
  // }

  // public static getPagination({
  //   page,
  //   pageSize,
  // }: {
  //   page?: string;
  //   pageSize?: string;
  // }): { take: number; skip: number } {
  //   const pageAsNumber = +(page || 1);

  //   const pageSizeAsNumber = +(pageSize || 50);

  //   const take = pageSizeAsNumber > 100 ? 100 : pageSizeAsNumber;

  //   const skip = take * (pageAsNumber - 1);

  //   return { take, skip };
  // }

  public static encodeCursor(str: string): string {
    return Buffer.from(str, 'utf-8').toString('base64');
  }

  public static extractCursor(str?: string): ExtractCursor {
    if (!str) {
      return;
    }
    const decoded = Buffer.from(str, 'base64').toString('utf-8');
    const cursor = decoded.split('::');
    return {
      type: cursor[0] === Cursors.before ? Cursors.before : Cursors.after,
      value: cursor[1],
    };
  }

  public static getCursors({ before, after }: GetCursors): PaginationCursors {
    return {
      after: !_.isNil(after)
        ? this.encodeCursor(`after::${after.toString()}`)
        : null,
      before: !_.isNil(before)
        ? this.encodeCursor(`before::${before.toString()}`)
        : null,
    };
  }
}
