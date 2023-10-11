import { DevicePlatform, UserGender, UserRole } from '../../commons/constants';

export type ClientData = AccessTokenSignPayload & {
  exp: number;
  iat: number;
};

export type AccessTokenSignPayload = {
  deviceId?: string;
  gender?: UserGender;
  id: string;
  platform?: DevicePlatform;
  role: UserRole;
  sub: string;
};

export type RefreshTokenSignPayload = {
  id: string;
  sub: string;
};

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
