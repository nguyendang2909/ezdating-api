import { UserRole } from '../../types';

export type ClientData = AccessTokenSignPayload & {
  exp: number;
  iat: number;
};

export type TokenSignPayload = {
  id: string;
  sub: string;
};

export type AccessTokenSignPayload = TokenSignPayload & {
  haveProfile: boolean;
  role: UserRole;
};

export type RefreshTokenSignPayload = TokenSignPayload;

export type RefreshTokenPayload = {
  id: string;
  sub: string;
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
