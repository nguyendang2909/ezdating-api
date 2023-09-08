// export type ExtractCursor = { type: string; value: string } | undefined;

import mongoose from 'mongoose';

export type MongoDocument<T> = T & {
  _id: mongoose.Types.ObjectId;
};
