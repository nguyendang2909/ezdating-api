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
import { EmbeddedProfile } from './embedded';
import { Message } from './message.schema';
export type MatchDocument = HydratedDocument<Match>;
export type MatchWithTargetProfileDocument = HydratedDocument<MatchWithTargetProfile>;
export type MatchWithTargetProfile = Omit<Match, 'profileOne' | 'profileTwo' | 'userOneRead' | 'userTwoRead'> & {
    read?: boolean;
    targetProfile: EmbeddedProfile;
};
export declare class Match extends CommonSchema {
    profileOne: EmbeddedProfile;
    profileTwo: EmbeddedProfile;
    targetProfile?: EmbeddedProfile;
    lastMessage?: Message;
    userOneRead: boolean;
    userTwoRead: boolean;
}
export declare const MatchSchema: import("mongoose").Schema<Match, import("mongoose").Model<Match, any, any, any, import("mongoose").Document<unknown, any, Match> & Match & Required<{
    _id: import("mongoose").Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Match, import("mongoose").Document<unknown, {}, Match> & Match & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
