/* eslint-disable sort-keys */
export const DATE_FORMATS = {
  RAW_BIRTHDAY: 'YYYY-MM-DD',
};

export const MODULE_INSTANCES = {
  REDIS: 'REDIS',
  REDIS_LOCK: 'REDIS_LOCK',
  FIREBASE: 'FIREBASE',
  GOOGLE_OAUTH_CLIENT: 'GOOGLE_OAUTH_CLIENT',
};

export const BULL_QUEUE_EVENTS = {
  SENT_LIKE: 'sent_like',
  SENT_MESSAGE: 'sent_message',
  MATCHES: 'matches',
};

export const BULL_QUEUE_JOBS = {
  MATCHES: {
    UNMATCHED: 'unmatched',
  },
};

export const FILE_UPLOAD_FOLDERS = {
  PHOTOS: 'photos',
  VIDEOS: 'videos',
} as const;

export const FILE_UPLOAD_FOLDERS_ARR: string[] =
  Object.values(FILE_UPLOAD_FOLDERS);

export const REGEXS = {
  BIRTHDAY: /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i,
};

export const COURSE_CATEGORIES = [
  { title: 'English', tag: 'english' },
  { title: 'Programming', tag: 'programming' },
];
