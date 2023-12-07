import { ClientData } from '../auth/auth.type';
import { ConversationsService } from './conversations.service';
import { FindManyConversationsQuery } from './dto/find-many-conversations.dto';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    findMany(queryParams: FindManyConversationsQuery, clientData: ClientData): Promise<{
        type: string;
        data: import("../models").MatchWithTargetProfile[];
        pagination: import("../../types").Pagination;
    }>;
}
