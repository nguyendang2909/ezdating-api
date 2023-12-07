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
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { BasicProfile, BasicProfileDocument } from './schemas';
import { Profile } from './schemas/profile.schema';
export declare class BasicProfileModel extends CommonModel<BasicProfile> {
    readonly model: Model<BasicProfileDocument>;
    constructor(model: Model<BasicProfileDocument>);
    createOne(doc: Partial<Profile> & {
        _id: Types.ObjectId;
    }): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, BasicProfile> & BasicProfile & Required<{
        _id: Types.ObjectId;
    }>>>;
}
