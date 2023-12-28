import { ClientData } from '../auth/auth.type';
import { ReadMessageDto } from './dto';
import { FindManyMessagesQuery } from './dto/find-many-messages.dto';
import { MessagesReadService } from './services/messages-read.service';
import { MessagesWriteService } from './services/messages-write.service';
export declare class MessagesController {
    private readonly readService;
    private readonly writeService;
    constructor(readService: MessagesReadService, writeService: MessagesWriteService);
    read(payload: ReadMessageDto, clientData: ClientData): Promise<void>;
    findMany(queryParams: FindManyMessagesQuery, clientData: ClientData): Promise<{
        type: string;
        _matchId: string;
        data: import("../models").Message[];
        pagination: import("../../types").Pagination;
    }>;
}
