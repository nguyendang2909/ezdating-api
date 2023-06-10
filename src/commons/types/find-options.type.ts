import { FindOneOptions, FindOptionsSelect, FindOptionsWhere } from 'typeorm';

export type FindOptions = {
  selects: string[];
};

export type EntityFindOneOptions<T> = Omit<
  FindOneOptions<T>,
  'select' | 'where'
> & {
  select: FindOptionsSelect<T>;
  where: FindOptionsWhere<T>[] | FindOptionsWhere<T>;
};
