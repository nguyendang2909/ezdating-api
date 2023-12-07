import { ApiCursorObjectIdService } from '../../commons';
import { Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { MatchModel } from '../models/match.model';
import { Match, MatchWithTargetProfile } from '../models/schemas/match.schema';
import { FindManyConversationsQuery } from './dto/find-many-conversations.dto';
export declare class ConversationsService extends ApiCursorObjectIdService {
    private readonly matchModel;
    constructor(matchModel: MatchModel);
    findMany(queryParams: FindManyConversationsQuery, clientData: ClientData): Promise<MatchWithTargetProfile[]>;
    getPagination(data: Array<Match | MatchWithTargetProfile>): Pagination;
}
