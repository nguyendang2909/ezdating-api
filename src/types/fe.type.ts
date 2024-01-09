/* eslint-disable @typescript-eslint/no-namespace */

import { Match, Message, Profile, User, View } from '../models';
import { MediaFile } from '../models/schemas/media-file.schema';
import {
  DevicePlatform,
  Gender,
  RelationshipGoal,
  RelationshipStatus,
} from './data.type';

export declare namespace ApiRequest {
  type FindAll = {
    fields?: string[];
  };

  type Pagination = {
    _next?: string;
    _prev?: string;
  };

  type FindMany<T> = Pagination & T;

  type IsExistUser = {
    phoneNumber: string;
  };

  type SignInWithPhoneNumber = {
    token: string;
  };

  type SignInWithGoogle = {
    token: string;
  };

  type SignInWithFacebook = {
    token: string;
  };

  type LoginByEmail = {
    email: string;
    password: string;
  };

  type LoginByGoogle = {
    token: string;
  };

  type LoginByFacebook = {
    token: string;
  };

  type LoginByPhoneNumber = {
    token: string;
  };

  type Logout = {
    refreshToken: string;
  };

  type UpdateProfile = Partial<{
    birthday?: string;
    company?: string;
    filterGender?: Gender;
    filterMaxAge?: number;
    filterMaxDistance?: number;
    filterMinAge?: number;
    // drinking?: EDrinking;
    // educationLevel?: EEducationLevel;
    gender?: Gender;
    haveBasicInfo?: boolean;
    height?: number;
    hideAge?: boolean;
    hideDistance?: boolean;
    introduce?: string;
    jobTitle?: string;
    languages?: string[];
    latitude?: number;
    longitude?: number;
    nickname?: string;
    photos?: string[];
    relationshipGoal: RelationshipGoal;
    relationshipStatus: RelationshipStatus;
    school?: string;
    weight?: number;
    // smoking?: ESmoking;
    // workout?: EWorkout;
  }>;

  type CreateProfile = {
    birthday: string;
    gender: Gender;
    introduce?: string;
    nickname: string;
    relationshipGoal: RelationshipGoal;
  };

  type SearchUsersNearby = Pagination;

  // type UploadPhoto = {
  //   file: Image;
  // };

  type FindManyConversations = Pagination;

  type FindManyMessages = FindMany<{ matchId: string }>;

  type FindManySwipeProfiles = FindMany<object>;

  type FindManyMatches = Pagination;

  type FindManyNearbyProfiles = Pagination;

  type SendLike = {
    targetUserId: string;
  };

  type SendView = {
    targetUserId: string;
  };

  type FindManyLikedMe = Pagination;

  type CreateMatch = {
    targetUserId: string;
  };

  type UpdateSignedDevice = {
    devicePlatform: DevicePlatform;
    deviceToken: string;
    refreshToken: string;
  };
}

export declare namespace ApiResponse {
  type Pagination = {
    _next: string | null;
    _prev?: string | null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type FetchData<T, R extends Record<string, any> = object> = {
    [P in keyof R]?: R[P];
  } & {
    data: T;
    type?: string;
  };

  type PaginatedResponse<T> = {
    data: T[];
    pagination: Pagination;
    type: string;
  };

  type MatchData = FetchData<Match>;

  type Matches = PaginatedResponse<Match>;

  type Likes = PaginatedResponse<View>;

  type Profiles = PaginatedResponse<Profile>;

  type Unmatch = FetchData<{ _id?: string }>;

  type SuccessResponse = FetchData<{ success: boolean }>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type FetchPaginationData<T, R extends Record<string, any> = object> = {
    [P in keyof R]?: R[P];
  } & FetchData<T, { pagination: Pagination }>;

  type Tokens = {
    accessToken: string;
    refreshToken: string;
  };

  type RemoveData = FetchData<{ success: true }>;

  type UploadedFileListData = FetchData<MediaFile[]>;

  type UserData = FetchData<User>;

  type ProfileData = FetchData<Profile>;

  type Logged = FetchData<{
    accessToken: string;
    refreshToken: string;
  }>;

  type Messages = PaginatedResponse<Message> & {
    _matchId: string;
  };
}
