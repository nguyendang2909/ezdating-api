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
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { ProfileFilterModel, ProfileModel, View } from '../models';
import { MatchModel } from '../models/match.model';
import { ViewModel } from '../models/view.model';
import { FindManyLikedMeDto } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';
import { LikesHandler } from './likes.handler';
export declare class LikesService extends ApiCursorDateService {
    private readonly chatsGateway;
    private readonly matchModel;
    private readonly viewModel;
    private readonly profileModel;
    private readonly likesHandler;
    private readonly profileFilterModel;
    constructor(chatsGateway: ChatsGateway, matchModel: MatchModel, viewModel: ViewModel, profileModel: ProfileModel, likesHandler: LikesHandler, profileFilterModel: ProfileFilterModel);
    logger: Logger;
    send(payload: SendLikeDto, clientData: ClientData): Promise<View>;
    findManyLikedMe(queryParams: FindManyLikedMeDto, clientData: ClientData): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, View> & View & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>> & import("mongoose").Document<unknown, {}, View> & View & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOneLikeMeById(id: string, client: ClientData): Promise<View>;
    getPagination(data: View[]): Pagination;
    verifyNotSameUserById(userOne: string, userTwo: string): void;
}
