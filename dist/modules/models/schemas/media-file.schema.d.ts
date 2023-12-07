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
import { Types } from 'mongoose';
import { CommonSchema } from '../../../commons/schemas.common';
import { MediaFileType } from '../../../types';
export type MediaFileDocument = HydratedDocument<MediaFile>;
export declare class MediaFile extends CommonSchema {
    _userId: Types.ObjectId;
    key: string;
    type: MediaFileType;
    location: string;
}
export declare const MediaFileSchema: import("mongoose").Schema<MediaFile, import("mongoose").Model<MediaFile, any, any, any, import("mongoose").Document<unknown, any, MediaFile> & MediaFile & Required<{
    _id: Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MediaFile, import("mongoose").Document<unknown, {}, MediaFile> & MediaFile & Required<{
    _id: Types.ObjectId;
}>>;
