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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { Pagination } from '../../../types';
import { ProfilesUtil } from '../../../utils';
import { PaginationCursorNumberUtil } from '../../../utils/paginations/pagination-cursor-number.util';
import { ClientData } from '../../auth/auth.type';
import { Profile, ProfileFilterModel, ProfileModel } from '../../models';
import { FindManyNearbyProfilesQuery } from '../dto';
export declare class NearbyProfilesService extends ApiReadService<Profile, FindManyNearbyProfilesQuery> {
    protected readonly profileModel: ProfileModel;
    protected readonly profileFilterModel: ProfileFilterModel;
    protected readonly profilesUtil: ProfilesUtil;
    protected readonly paginationUtil: PaginationCursorNumberUtil;
    constructor(profileModel: ProfileModel, profileFilterModel: ProfileFilterModel, profilesUtil: ProfilesUtil, paginationUtil: PaginationCursorNumberUtil);
    findMany(queryParams: FindManyNearbyProfilesQuery, client: ClientData): Promise<Profile[]>;
    getPagination(data: (Profile & {
        excludedUserIds?: string[];
    })[]): Pagination;
    test(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Profile> & Profile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>> & import("mongoose").Document<unknown, {}, Profile> & Profile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
