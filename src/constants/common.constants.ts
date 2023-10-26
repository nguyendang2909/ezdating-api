/* eslint-disable sort-keys */
export const DATE_FORMATS = {
  RAW_BIRTHDAY: 'YYYY-MM-DD',
};

export const MODULE_INSTANCES = {
  REDIS: 'REDIS',
  REDIS_LOCK: 'REDIS_LOCK',
};

export const FILE_UPLOAD_FOLDERS = {
  PHOTOS: 'photos',
} as const;

export const FILE_UPLOAD_FOLDERS_ARR: string[] =
  Object.values(FILE_UPLOAD_FOLDERS);

export const REGEXS = {
  BIRTHDAY: /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i,
};
