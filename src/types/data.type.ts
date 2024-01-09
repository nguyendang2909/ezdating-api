import { SignInDto } from '../api/auth/dto';
import {
  DEVICE_PLATFORMS,
  EDUCATION_LEVELS,
  GENDERS,
  MEDIA_FILE_TYPES,
  MEMBERSHIPS,
  RELATIONSHIP_GOALS,
  RELATIONSHIP_STATUSES,
  RESPONSE_TYPES,
  USER_ROLES,
  USER_STATUSES,
  WEEKLY_COINS,
} from '../constants/data.constant';

export type ValueOf<T> = T[keyof T];

export type Pagination = {
  _next?: null | string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
  type: ResponseType;
};

export type SingleResponse<T> = {
  data: T;
  type: ResponseType;
};

export type UserStatus = ValueOf<typeof USER_STATUSES>;

export type Gender = ValueOf<typeof GENDERS>;

export type UserRole = ValueOf<typeof USER_ROLES>;

export type RelationshipGoal = ValueOf<typeof RELATIONSHIP_GOALS>;

export type RelationshipStatus = ValueOf<typeof RELATIONSHIP_STATUSES>;

export type EducationLevel = ValueOf<typeof EDUCATION_LEVELS>;

export type MediaFileType = ValueOf<typeof MEDIA_FILE_TYPES>;

export type DevicePlatform = ValueOf<typeof DEVICE_PLATFORMS>;

export type Membership = ValueOf<typeof MEMBERSHIPS>;

export type ResponseType = ValueOf<typeof RESPONSE_TYPES>;

export type WeeklyCoin = (typeof WEEKLY_COINS)[number];

export type SignInPayload = {
  appleId?: string;
  email?: string;
  facebookId?: string;
  phoneNumber?: string;
};

export type SignInPayloadWithToken = SignInPayload & SignInDto;
