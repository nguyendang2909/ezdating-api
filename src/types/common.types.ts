// export type ExtractCursor = { type: string; value: string } | undefined;

import { Types } from 'mongoose';

import { ERROR_MESSAGES } from '../commons/messages';
import { DevicePlatform } from './data.type';

export type MongoDocument<T> = T & {
  _id: Types.ObjectId;
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

export type _CurrentTargetUserIds = {
  _currentUserId: Types.ObjectId;
  _targetUserId: Types.ObjectId;
};

export type _UserOneTwoIds = {
  _userOneId: Types.ObjectId;
  _userTwoId: Types.ObjectId;
};

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];

export type SendPushNotificationByProfileOptions = {
  recentActive?: boolean;
};
