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
export type EmbeddedCountryDocument = HydratedDocument<EmbeddedCountry>;
export declare class EmbeddedCountry extends CommonEmbeddedSchema {
    name: string;
    iso2: string;
    native: string;
}
export declare const EmbeddedCountrySchema: import("mongoose").Schema<EmbeddedCountry, import("mongoose").Model<EmbeddedCountry, any, any, any, import("mongoose").Document<unknown, any, EmbeddedCountry> & EmbeddedCountry & Required<{
    _id: import("mongoose").Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EmbeddedCountry, import("mongoose").Document<unknown, {}, EmbeddedCountry> & EmbeddedCountry & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
