export const UserRoles = {
  admin: 1,
  manager: 2,
  member: 3,
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const UserGenders = {
  male: 1,
  female: 2,
} as const;

export type UserGender = (typeof UserGenders)[keyof typeof UserGenders];

export const UserStatuses = {
  verified: 5,
  activated: 4,
  registered: 3,
  deactivated: 2,
  banned: 1,
} as const;

export type UserStatus = (typeof UserStatuses)[keyof typeof UserStatuses];

export const UserLookingFors = {
  boyGirlFriend: 1,
  makeFriends: 2,
  sexPartner: 3,
  getMarried: 4,
  oneNightStand: 5,
} as const;

export type UserLookingFor =
  (typeof UserLookingFors)[keyof typeof UserLookingFors];

export const UserRelationshipStatuses = {
  single: 1,
  haveBoyGirlFriend: 2,
  married: 3,
  divorcedWithoutChildren: 4,
  divorcedWithChildren: 5,
  singleMomDad: 6,
} as const;

export type UserRelationshipStatus =
  (typeof UserRelationshipStatuses)[keyof typeof UserRelationshipStatuses];

export const UserEducationLevels = {
  highSchool: 1,
  bachelor: 2,
  associate: 3,
  undergraduate: 4,
  master: 5,
  doctor: 6,
  professor: 7,
} as const;

export type UserEducationLevel =
  (typeof UserEducationLevels)[keyof typeof UserEducationLevels];

export const UserJobs = {
  freelancer: 1,
  doctor: 2,
  programmer: 3,
  webDesign: 4,
  networkAdministrator: 5,
  bridgeEngineer: 6,
  qa: 7,
  salesman: 8,
  salesManager: 9,
  painter: 10,
  fashionDesigner: 11,
} as const;

export type UserJob = (typeof UserJobs)[keyof typeof UserJobs];

export const MediaFileTypes = {
  photo: 1,
  video: 2,
} as const;

export type MediaFileType =
  (typeof MediaFileTypes)[keyof typeof MediaFileTypes];

export const WeeklyCoins = [10, 20, 40, 70, 110, 160, 220];

export const WeeklyCoinsLength = WeeklyCoins.length;

export const DevicePlatforms = {
  web: 1,
  ios: 2,
  android: 3,
} as const;

export type DevicePlatform =
  (typeof DevicePlatforms)[keyof typeof DevicePlatforms];

export const Constants = {
  socketEvents: {
    toServer: {
      sendMessage: 'sendMsg',
      matched: 'matched',
    },
    toClient: {
      error: 'error',
      updateMessage: 'updateMsg',
      newMessage: 'msg',
      cancelMatched: 'cancelMatched',
    },
  },
};
