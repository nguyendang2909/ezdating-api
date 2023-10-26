export const USER_ROLES = {
  ADMIN: 1,
  MANAGER: 2,
  MEMBER: 3,
} as const;

export const USER_STATUSES = {
  VERIFIED: 4,
  ACTIVATED: 3,
  DEACTIVATED: 2,
  BANNED: 1,
} as const;

export const GENDERS = {
  MALE: 1,
  FEMALE: 2,
} as const;

export const RELATIONSHIP_GOALS = {
  BOY_GIRL_FRIEND: 1,
  MAKE_FRIENDS: 2,
  SEX_PARTNER: 3,
  GET_MARRIED: 4,
  ONE_NIGHT_STAND: 5,
} as const;

export const RELATIONSHIP_STATUSES = {
  SINGLE: 1,
  HAVE_BOY_GIRL_FRIEND: 2,
  MARRIED: 3,
  DIVORCED_WITHOUT_CHILDREN: 4,
  DIVORCED_WITH_CHILDREN: 5,
  SINGLE_MOM_DAD: 6,
} as const;

export const EDUCATION_LEVELS = {
  HIGH_SCHOOL: 1,
  BACHELOR: 2,
  ASSOCIATE: 3,
  UNDERGRADUATE: 4,
  MASTER: 5,
  DOCTOR: 6,
  PROFESSOR: 7,
} as const;

export const MEDIA_FILE_TYPES = {
  photo: 1,
  video: 2,
} as const;

export const WEEKLY_COINS = [10, 20, 40, 70, 110, 160, 220];

export const WEEKLY_COINS_LENGTH = WEEKLY_COINS.length;

export const DEVICE_PLATFORMS = {
  OTHER: 1,
  WEB: 2,
  IOS: 3,
  ANDROID: 4,
} as const;

export const SOCKET_TO_SERVER_EVENTS = {
  SEND_MESSAGE: 'sendMsg',
  EDIT_MESSAGE: 'editMsg',
  READ_MESSAGE: 'readMsg',
} as const;

export const SOCKET_TO_CLIENT_EVENTS = {
  CANCEL_MATCH: 'cancelMatch',
  ERROR: 'error',
  NEW_MESSAGE: 'msg',
  UPDATE_SENT_MESSAGE: 'updateSentMsg',
  MATCH: 'match',
  EDIT_SENT_MESSAGE: 'editSentMsg',
} as const;

export const MEMBERSHIPS = {
  FREE: 1,
  TRIAL: 2,
  GOLD: 3,
  PLATINUM: 4,
};
