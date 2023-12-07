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
export type CountryDocument = HydratedDocument<Country>;
export declare class Country extends CommonSchema {
    name: string;
    iso3: string;
    numericCode: string;
    iso2: string;
    phoneCode: string;
    capital: string;
    currency: string;
    currencyName: string;
    currencySymbol: string;
    tld: string;
    native: string;
    region: string;
    subregion: string;
    translations: string;
    latitude: string;
    longitude: string;
    emoji: string;
    emojiU: string;
    sourceId: number;
}
export declare const CountrySchema: import("mongoose").Schema<Country, import("mongoose").Model<Country, any, any, any, import("mongoose").Document<unknown, any, Country> & Country & Required<{
    _id: import("mongoose").Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Country, import("mongoose").Document<unknown, {}, Country> & Country & Required<{
    _id: import("mongoose").Types.ObjectId;
}>>;
