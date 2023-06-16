import { EUserRole } from '../users/users.constant';

export type AuthJwtPayload = {
  sub: string;
  id: string;
  role: EUserRole;
  iat: number;
  exp: number;
};

export type AuthJwtSignPayload = {
  sub: string;
  id: string;
  role: EUserRole;
};

export type FindOneAuthUserConditions = {
  phoneNumber?: string;
};

export type CreateUserPayload = {
  phoneNumber?: string;
};

export type SignInData = {
  accessToken: string;
};
