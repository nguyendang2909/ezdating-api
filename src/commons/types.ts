// export type ExtractCursor = { type: string; value: string } | undefined;

import mongoose from 'mongoose';

export type MongoDocument<T> = T & {
  _id: mongoose.Types.ObjectId;
};

// export type PaginationCursors = {
//   next: string | null;
//   prev: string | null;
// };

// export type GetCursors = {
//   next?: string | null;
//   prev?: string | null;
// };

// export const Cursors = {
//   next: 'next',
//   prev: 'prev',
// };

// export type Cursor = (typeof Cursors)[keyof typeof Cursors];

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
  type: string;
};

export type Pagination = {
  _next?: null | string;
};