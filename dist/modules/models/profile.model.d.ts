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
import { CacheService } from '../../libs';
import { CommonModel } from './bases/common-model';
import { Profile, ProfileDocument } from './schemas/profile.schema';
export declare class ProfileModel extends CommonModel<Profile> {
    readonly model: Model<ProfileDocument>;
    private readonly cacheService;
    constructor(model: Model<ProfileDocument>, cacheService: CacheService);
    publicFields: {
        _id: number;
        birthday: number;
        company: number;
        createdAt: number;
        distance: number;
        educationLevel: number;
        gender: number;
        height: number;
        hideAge: number;
        hideDistance: number;
        introduce: number;
        jobTitle: number;
        languages: number;
        lastActivatedAt: number;
        mediaFiles: {
            _id: number;
            key: number;
            type: number;
        };
        nickname: number;
        photoVerified: number;
        relationshipGoal: number;
        relationshipStatus: number;
        school: number;
        state: number;
        weight: number;
    };
    matchProfileFields: {
        _id: number;
        birthday: number;
        createdAt: number;
        gender: number;
        hideAge: number;
        hideDistance: number;
        mediaFiles: {
            _id: number;
            key: number;
            type: number;
        };
        nickname: number;
        photoVerified: number;
        state: number;
    };
    createOne(doc: Partial<Profile> & {
        _id: Types.ObjectId;
    }): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Profile> & Profile & Required<{
        _id: Types.ObjectId;
    }>>>;
    findTwoOrFailPublicByIds(_userId: Types.ObjectId, _otherUserId: Types.ObjectId): Promise<{
        profileOne: Profile;
        profileTwo: Profile;
    }>;
    getAgeFromBirthday(birthday: Date): number;
    verifyCanUploadFiles(profile: Profile): number;
}
