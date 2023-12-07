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
import { CommonEmbeddedSchema } from '../../../../commons/schemas.common';
import { Gender } from '../../../../types';
import { EmbeddedMediaFile } from './embedded-media-file.schema';
import { EmbeddedState } from './embeded-state.schema';
export type EmbeddedProfileDocument = HydratedDocument<EmbeddedProfile>;
export declare class EmbeddedProfile extends CommonEmbeddedSchema {
    birthday: Date;
    gender: Gender;
    hideAge: boolean;
    hideDistance: boolean;
    introduce?: string;
    lastActivatedAt: Date;
    mediaFiles: EmbeddedMediaFile[];
    nickname: string;
    photoVerified: boolean;
    state: EmbeddedState;
}
export declare const EmbeddedProfileSchema: import("mongoose").Schema<EmbeddedProfile, import("mongoose").Model<EmbeddedProfile, any, any, any, import("mongoose").Document<unknown, any, EmbeddedProfile> & EmbeddedProfile & Required<{
    _id: import("mongoose").Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EmbeddedProfile, import("mongoose").Document<unknown, {}, EmbeddedProfile> & EmbeddedProfile & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
