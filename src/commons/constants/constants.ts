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
  activated: 1,
  deactivate: 2,
  banned: 3,
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

export const RelationshipUserStatuses = {
  like: 1,
  unlike: 2,
  cancel: 3,
  block: 4,
  viewed: 5,
} as const;

export type RelationshipUserStatus =
  (typeof RelationshipUserStatuses)[keyof typeof RelationshipUserStatuses];

export const UploadFileTypes = {
  photo: 1,
  video: 2,
} as const;

export type UploadFileType =
  (typeof UploadFileTypes)[keyof typeof UploadFileTypes];

// export const UploadFileShares = {
//   public: 'public',
//   private: 'private',
// };

// export type UploadFileShare =
//   (typeof UploadFileShares)[keyof typeof UploadFileShares];

export const CoinTypes = {
  daily: 1,
};

export type CoinType = (typeof CoinTypes)[keyof typeof CoinTypes];
