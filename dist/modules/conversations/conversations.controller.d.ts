import { ClientData } from '../auth/auth.type';
import { FindManyConversationsQuery } from './dto/find-many-conversations.dto';
import { ConversationsReadService } from './services/conversations-read.service';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsReadService);
    findMany(queryParams: FindManyConversationsQuery, clientData: ClientData): Promise<{
        type: string;
        data: import("../models").MatchWithTargetProfile[];
        pagination: import("../../types").Pagination;
    }>;
}
