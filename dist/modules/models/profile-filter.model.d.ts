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
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { Gender } from '../../types';
import { CommonModel } from './bases/common-model';
import { ProfileModel } from './profile.model';
import { BasicProfile, Profile, ProfileFilter, ProfileFilterDocument } from './schemas';
export declare class ProfileFilterModel extends CommonModel<ProfileFilter> {
    readonly model: Model<ProfileFilterDocument>;
    readonly profileModel: ProfileModel;
    constructor(model: Model<ProfileFilterDocument>, profileModel: ProfileModel);
    createOne(doc: Pick<ProfileFilter, '_id' | 'gender' | 'minAge' | 'maxAge' | 'maxDistance'>): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, ProfileFilter> & ProfileFilter & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>>;
    createOneFromProfile(profile: Profile | BasicProfile): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, ProfileFilter> & ProfileFilter & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>>;
    findOneOrFail(filter: FilterQuery<ProfileFilter>, projection?: ProjectionType<ProfileFilter> | null | undefined, options?: QueryOptions<ProfileFilter> | null | undefined): Promise<ProfileFilter>;
    getFilterGender(gender: Gender): 1 | 2;
}
