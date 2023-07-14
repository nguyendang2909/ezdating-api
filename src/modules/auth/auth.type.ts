import { UserRole } from '../../commons/constants/enums';

export type AccessTokenPayload = {
  sub: string;
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export type AccessTokenSignPayload = {
  sub: string;
  id: string;
  role: UserRole;
};

export type RefreshTokenSignPayload = {
  sub: string;
  id: string;
};

export type RefreshTokenPayload = {
  sub: string;
  id: string;
};

export type FindOneAuthUserConditions = {
  phoneNumber?: string;
};

export type CreateUserPayload = {
  phoneNumber?: string;
};

export type SignInData = {
  accessToken: string;
  refreshToken: string;
};
