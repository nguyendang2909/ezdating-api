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
import { ClientData } from '../auth/auth.type';
import { CreateMatchDto, FindManyMatchesQuery } from './dto';
import { MatchesReadService } from './services/matches-read.service';
import { MatchesWriteService } from './services/matches-write.service';
export declare class MatchesController {
    private readonly writeService;
    private readonly readService;
    constructor(writeService: MatchesWriteService, readService: MatchesReadService);
    createOne(payload: CreateMatchDto, client: ClientData): Promise<{
        type: string;
        data: import("../models").MatchWithTargetProfile;
    }>;
    unmatch(id: string, clientData: ClientData): Promise<{
        type: string;
        data: {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    findMatched(queryParams: FindManyMatchesQuery, clientData: ClientData): Promise<{
        type: string;
        data: import("../models").MatchWithTargetProfile[];
        pagination: import("../../types").Pagination;
    }>;
    findOneByTargetUserId(targetUserId: string, client: ClientData): Promise<{
        type: string;
        data: {
            targetProfile: import("../models").Profile;
            _id: import("mongoose").Types.ObjectId;
            createdAt: Date;
            updatedAt: Date;
            lastMessage?: import("../models").Message | undefined;
            userOneRead: boolean;
            userTwoRead: boolean;
        };
    }>;
    findOneById(id: string, clientData: ClientData): Promise<{
        type: string;
        data: {
            targetProfile: import("../models").Profile;
            _id: import("mongoose").Types.ObjectId;
            createdAt: Date;
            updatedAt: Date;
            lastMessage?: import("../models").Message | undefined;
            userOneRead: boolean;
            userTwoRead: boolean;
        };
    }>;
}
