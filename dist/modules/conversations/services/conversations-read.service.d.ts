import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { Pagination } from '../../../types';
import { PaginationCursorStringUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { MatchModel } from '../../models/match.model';
import { Match, MatchWithTargetProfile } from '../../models/schemas/match.schema';
import { FindManyConversationsQuery } from '../dto/find-many-conversations.dto';
export declare class ConversationsReadService extends ApiReadService<MatchWithTargetProfile> {
    private readonly matchModel;
    protected readonly paginationUtil: PaginationCursorStringUtil;
    constructor(matchModel: MatchModel, paginationUtil: PaginationCursorStringUtil);
    findMany(queryParams: FindManyConversationsQuery, clientData: ClientData): Promise<MatchWithTargetProfile[]>;
    getPagination(data: Array<Match | MatchWithTargetProfile>): Pagination;
}
