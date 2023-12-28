import { Types } from 'mongoose';
import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { Pagination } from '../../../types';
import { PaginationCursorDateUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { Match } from '../../models';
import { MatchModel } from '../../models/match.model';
import { MessageModel } from '../../models/message.model';
import { Message } from '../../models/schemas/message.schema';
import { FindManyMessagesQuery } from '../dto/find-many-messages.dto';
export declare class MessagesReadService extends ApiReadService<Message> {
    private readonly matchModel;
    private readonly messageModel;
    private readonly paginationUtil;
    constructor(matchModel: MatchModel, messageModel: MessageModel, paginationUtil: PaginationCursorDateUtil);
    findMany(queryParams: FindManyMessagesQuery, clientData: ClientData): Promise<Message[]>;
    getPagination(data: Message[]): Pagination;
    handleAfterFindManyMessages({ _matchId, currentUserId, match, }: {
        _matchId: Types.ObjectId;
        currentUserId: string;
        match: Match;
    }): Promise<void>;
}
