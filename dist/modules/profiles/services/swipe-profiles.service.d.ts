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
import { Types } from 'mongoose';
import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { ClientData } from '../../auth/auth.type';
import { Profile, ProfileFilterModel, ProfileModel, ViewModel } from '../../models';
import { FindManySwipeProfilesQuery } from '../dto';
export declare class SwipeProfilesService extends ApiReadService<Profile, FindManySwipeProfilesQuery> {
    private readonly profileModel;
    private readonly profileFilterModel;
    private readonly viewModel;
    constructor(profileModel: ProfileModel, profileFilterModel: ProfileFilterModel, viewModel: ViewModel);
    findMany(queryParams: FindManySwipeProfilesQuery, clientData: ClientData): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Profile> & Profile & Required<{
        _id: Types.ObjectId;
    }>> & import("mongoose").Document<unknown, {}, Profile> & Profile & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getExcludedUserIds(profile: Profile, excludedUserId?: string | string[]): Promise<Types.ObjectId[]>;
}
