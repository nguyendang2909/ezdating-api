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
} from '../constants/data.constant';

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

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export type Gender = (typeof GENDERS)[keyof typeof GENDERS];

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type RelationshipGoal =
  (typeof RELATIONSHIP_GOALS)[keyof typeof RELATIONSHIP_GOALS];

export type RelationshipStatus =
  (typeof RELATIONSHIP_STATUSES)[keyof typeof RELATIONSHIP_STATUSES];

export type EducationLevel =
  (typeof EDUCATION_LEVELS)[keyof typeof EDUCATION_LEVELS];

export type MediaFileType =
  (typeof MEDIA_FILE_TYPES)[keyof typeof MEDIA_FILE_TYPES];

export type DevicePlatform =
  (typeof DEVICE_PLATFORMS)[keyof typeof DEVICE_PLATFORMS];

export type Membership = (typeof MEMBERSHIPS)[keyof typeof MEMBERSHIPS];

export type ResponseType = (typeof RESPONSE_TYPES)[keyof typeof RESPONSE_TYPES];
