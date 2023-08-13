export type PaginationCursors = {
  after: string | null;
  before: string | null;
};

export type GetCursors = {
  after?: string | null;
  before?: string | null;
};

export const Cursors = {
  after: 'after',
  before: 'before',
};

export type Cursor = (typeof Cursors)[keyof typeof Cursors];

export type ResponsePagination<T> = {
  type?: string;
  data: T[];
  pagination: {
    cursors: {
      before: null | string;
      after: null | string;
    };
  };
};
