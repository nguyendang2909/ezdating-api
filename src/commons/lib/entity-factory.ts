import { Cursors, PaginationCursors } from '../constants/paginations';

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

  public static extractCursor(
    str?: string,
  ): { type: string; value: string } | undefined {
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

  public static getCursors(value?: string | Date): PaginationCursors {
    if (value) {
      return {
        after: this.encodeCursor(`$after::${value.toString()}`),
        before: this.encodeCursor(`before::${value.toString()}`),
      };
    }

    return {
      after: null,
      before: null,
    };
  }
}
