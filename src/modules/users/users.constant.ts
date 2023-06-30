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
};

export type UserStatus = (typeof UserStatuses)[keyof typeof UserStatuses];

export const UserLookingFors = {
  lover: 'lover',
  friend: 'friend',
  partner: 'partner',
  marriage: 'marriage',
  oneNightStand: 'oneNightStand',
};

export type UserLookingFor =
  (typeof UserLookingFors)[keyof typeof UserLookingFors];
