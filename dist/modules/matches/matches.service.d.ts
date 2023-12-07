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
import { Logger } from '@nestjs/common';
import { ApiCursorDateService } from '../../commons';
import { Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { ProfileModel } from '../models';
import { MatchModel } from '../models/match.model';
import { Match, MatchWithTargetProfile } from '../models/schemas/match.schema';
import { CreateMatchDto, FindManyMatchesQuery } from './dto';
import { MatchesHandler } from './matches.handler';
export declare class MatchesService extends ApiCursorDateService {
    private readonly matchModel;
    private readonly profileModel;
    private readonly matchesHandler;
    constructor(matchModel: MatchModel, profileModel: ProfileModel, matchesHandler: MatchesHandler);
    logger: Logger;
    createOne(payload: CreateMatchDto, clientData: ClientData): Promise<MatchWithTargetProfile>;
    unmatch(id: string, clientData: ClientData): Promise<{
        _id: import("mongoose").Types.ObjectId;
    }>;
    findMany(queryParams: FindManyMatchesQuery, clientData: ClientData): Promise<MatchWithTargetProfile[]>;
    findOneOrFailById(id: string, client: ClientData): Promise<{
        targetProfile: import("../models").Profile;
        _id: import("mongoose").Types.ObjectId;
        createdAt: Date;
        updatedAt: Date;
        lastMessage?: import("../models").Message | undefined;
        userOneRead: boolean;
        userTwoRead: boolean;
    }>;
    findOneByTargetUserId(targetUserId: string, client: ClientData): Promise<{
        targetProfile: import("../models").Profile;
        _id: import("mongoose").Types.ObjectId;
        createdAt: Date;
        updatedAt: Date;
        lastMessage?: import("../models").Message | undefined;
        userOneRead: boolean;
        userTwoRead: boolean;
    }>;
    getPagination(data: Array<Match | MatchWithTargetProfile>): Pagination;
}
