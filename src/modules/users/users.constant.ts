export const UserRoles = {
  admin: 'admin',
  manager: 'manager',
  member: 'member',
};

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const UserGenders = {
  male: 'male',
  female: 'female',
  lgbt: 'lgbt',
};
export type UserGender = (typeof UserGenders)[keyof typeof UserGenders];

export const UserStatuses = {
  banned: 'banned',
  activated: 'activated',
  deactivate: 'deactivate',
} as const;

export type UserStatus = (typeof UserStatuses)[keyof typeof UserStatuses];

export const UserLookingFors = {
  boyGirlFriend: 'boyGirlFriend',
  makeFriends: 'makeFriends',
  sexPartner: 'sexPartner',
  getMarried: 'getMarried',
  oneNightStand: 'oneNightStand',
} as const;

export type UserLookingFor =
  (typeof UserLookingFors)[keyof typeof UserLookingFors];

export const UserRelationshipStatuses = {
  single: 'single',
  haveFriend: 'haveBoyGirlFriend',
  married: 'married',
  divorcedWithouChildren: 'divorcedWithouChildren',
  divorcedWithChildren: 'divorcedWithChildren',
  singleMomDad: 'singleMomDad',
} as const;

export type UserRelationshipStatus =
  (typeof UserRelationshipStatuses)[keyof typeof UserRelationshipStatuses];

export const UserEducationLevels = {
  highSchool: 'highSchool',
  bachelor: 'bachelor',
  associate: 'associate',
  undergraduate: 'undergraduate',
  master: 'master',
  doctor: 'doctor',
  professor: 'professor',
} as const;

export type UserEducationLevel =
  (typeof UserEducationLevels)[keyof typeof UserEducationLevels];
