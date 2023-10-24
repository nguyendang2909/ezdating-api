// export type ExtractCursor = { type: string; value: string } | undefined;

import mongoose from 'mongoose';

import { DevicePlatform } from './data.type';

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

export type NearbyUserCursor = {
  excludedUserIds?: string[];
  minDistance?: number;
};

export type SendPushNotificationPayload = {
  content: string;
  devicePlatform: DevicePlatform;
  deviceToken: string;
  title: string;
};

export type SendPushNotificationContent = {
  content: string;
  title: string;
};
