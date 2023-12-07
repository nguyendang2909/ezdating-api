import { ClientData } from '../auth/auth.type';
import { ReadMessageDto } from './dto';
import { FindManyMessagesQuery } from './dto/find-many-messages.dto';
import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    read(payload: ReadMessageDto, clientData: ClientData): Promise<void>;
    findMany(queryParams: FindManyMessagesQuery, clientData: ClientData): Promise<{
        type: string;
        _matchId: string;
        data: import("../models").Message[];
        pagination: import("../../types").Pagination;
    }>;
}
