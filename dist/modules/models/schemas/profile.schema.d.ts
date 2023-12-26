/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { HydratedDocument } from 'mongoose';
import { CommonSchema } from '../../../commons/schemas.common';
import { EducationLevel, Gender, Membership, RelationshipGoal, RelationshipStatus } from '../../../types';
import { EmbeddedMediaFile } from './embedded/embedded-media-file.schema';
import { EmbeddedState } from './embedded/embeded-state.schema';
export type ProfileDocument = HydratedDocument<Profile>;
export type MongoGeoLocation = {
    coordinates: [number, number];
    type: 'Point';
};
export declare class Profile extends CommonSchema {
    birthday: Date;
    company?: string;
    educationLevel?: EducationLevel;
    gender: Gender;
    geolocation?: MongoGeoLocation;
    height?: number;
    introduce?: string;
    jobTitle?: string;
    hideAge: boolean;
    hideDistance: boolean;
    languages?: string[];
    lastActivatedAt: Date;
    learningTarget?: string;
    mediaFiles: EmbeddedMediaFile[];
    membership: Membership;
    nickname: string;
    photoVerified: boolean;
    relationshipGoal: RelationshipGoal;
    relationshipStatus?: RelationshipStatus;
    school?: string;
    state: EmbeddedState;
    weight?: number;
    distance?: string;
}
export declare const ProfileSchema: import("mongoose").Schema<Profile, import("mongoose").Model<Profile, any, any, any, import("mongoose").Document<unknown, any, Profile> & Profile & Required<{
    _id: import("mongoose").Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Profile, import("mongoose").Document<unknown, {}, Profile> & Profile & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
