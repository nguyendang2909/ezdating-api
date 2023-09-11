export type PaginationCursors = {
  next: string | null;
  prev: string | null;
};

export type GetCursors = {
  next?: string | null;
  prev?: string | null;
};

export const Cursors = {
  next: 'next',
  prev: 'prev',
};

export type Cursor = (typeof Cursors)[keyof typeof Cursors];

export type ResponsePagination<T> = {
  type?: string;
  data: T[];
  pagination?: {
    cursors?: {
      next?: null | string;
      prev?: null | string;
    };
  };
};
