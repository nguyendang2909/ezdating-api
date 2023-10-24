import {
  DEVICE_PLATFORMS,
  EDUCATION_LEVELS,
  GENDERS,
  MEDIA_FILE_TYPES,
  RELATIONSHIP_GOALS,
  RELATIONSHIP_STATUSES,
  USER_ROLES,
  USER_STATUSES,
} from '../constants/data.constant';

export type Pagination = {
  _next?: null | string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
  type: string;
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
