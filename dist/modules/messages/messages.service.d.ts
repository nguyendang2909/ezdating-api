import { Types } from 'mongoose';
import { ApiService } from '../../commons/services/api.service';
import { Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { Match } from '../models';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { Message } from '../models/schemas/message.schema';
import { UserModel } from '../models/user.model';
import { ReadMessageDto } from './dto';
import { FindManyMessagesQuery } from './dto/find-many-messages.dto';
export declare class MessagesService extends ApiService {
    private readonly matchModel;
    private readonly userModel;
    private readonly messageModel;
    constructor(matchModel: MatchModel, userModel: UserModel, messageModel: MessageModel);
    read(payload: ReadMessageDto, client: ClientData): Promise<void>;
    findMany(queryParams: FindManyMessagesQuery, clientData: ClientData): Promise<Message[]>;
    getPagination(data: Message[]): Pagination;
    handleAfterFindManyMessages({ _matchId, currentUserId, match, }: {
        _matchId: Types.ObjectId;
        currentUserId: string;
        match: Match;
    }): Promise<void>;
}
