export type PaginationCursors = {
  after: string | null;
  before: string | null;
};

export const Cursors = {
  after: 'after',
  before: 'before',
};

export type Cursor = (typeof Cursors)[keyof typeof Cursors];
