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
import { MediaFile } from '../media-file.schema';
export type TrashMediaFileDocument = HydratedDocument<TrashMediaFile>;
export declare class TrashMediaFile extends MediaFile {
}
export declare const TrashMediaFileSchema: import("mongoose").Schema<TrashMediaFile, import("mongoose").Model<TrashMediaFile, any, any, any, import("mongoose").Document<unknown, any, TrashMediaFile> & TrashMediaFile & Required<{
    _id: import("mongoose").Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TrashMediaFile, import("mongoose").Document<unknown, {}, TrashMediaFile> & TrashMediaFile & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
