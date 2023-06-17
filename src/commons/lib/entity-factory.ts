import _ from 'lodash';

export class EntityFactory {
  public static getEntityName(Entity: Record<string, any>): string {
    const EntityName = Entity.name;

    return EntityName[0].toLowerCase() + EntityName.slice(1);
  }

  public static getPagination({
    page,
    pageSize,
  }: {
    page?: string;
    pageSize?: string;
  }): { take: number; skip: number } {
    const pageAsNumber = +(page || 1);

    const pageSizeAsNumber = +(pageSize || 50);

    const take = pageSizeAsNumber > 100 ? 100 : pageSizeAsNumber;

    const skip = take * (pageAsNumber - 1);

    return { take, skip };
  }

  public static encodeCursor(str: string): string {
    return Buffer.from(str, 'utf-8').toString('base64');
  }

  public static decodeCursor(str: string): string {
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  public static getCursor<T extends { id?: string }[]>(arr: T): string | null {
    const cursorAsString = _.last(arr)?.id;
    if (cursorAsString) {
      return this.encodeCursor(cursorAsString);
    }

    return null;
  }
}
