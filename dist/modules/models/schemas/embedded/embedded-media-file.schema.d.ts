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
import { MediaFileType } from '../../../../types';
export type EmbeddedMediaFileDocument = HydratedDocument<EmbeddedMediaFile>;
export declare class EmbeddedMediaFile extends CommonEmbeddedSchema {
    key: string;
    type: MediaFileType;
}
export declare const EmbeddedMediaFileSchema: import("mongoose").Schema<EmbeddedMediaFile, import("mongoose").Model<EmbeddedMediaFile, any, any, any, import("mongoose").Document<unknown, any, EmbeddedMediaFile> & EmbeddedMediaFile & Required<{
    _id: import("mongoose").Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EmbeddedMediaFile, import("mongoose").Document<unknown, {}, EmbeddedMediaFile> & EmbeddedMediaFile & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
