import { UserGender, UserRole } from '../../commons/constants/constants';

export type ClientData = AccessTokenSignPayload & {
  iat: number;
  exp: number;
};

export type AccessTokenSignPayload = {
  sub: string;
  id: string;
  role: UserRole;
  gender?: UserGender;
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
