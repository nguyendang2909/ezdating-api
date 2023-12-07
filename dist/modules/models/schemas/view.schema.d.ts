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
export type ViewDocument = HydratedDocument<View>;
export declare class View extends CommonSchema {
    profile: EmbeddedProfile;
    targetProfile: EmbeddedProfile;
    isLiked: boolean;
    isMatched: boolean;
}
export declare const ViewSchema: import("mongoose").Schema<View, import("mongoose").Model<View, any, any, any, import("mongoose").Document<unknown, any, View> & View & Required<{
    _id: import("mongoose").Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, View, import("mongoose").Document<unknown, {}, View> & View & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
