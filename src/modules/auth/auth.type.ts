import { UserRole } from '../users/users.constant';

export type AuthJwtPayload = {
  sub: string;
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export type AuthJwtSignPayload = {
  sub: string;
  id: string;
  role: UserRole;
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
