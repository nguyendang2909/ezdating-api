import { ClientData } from '../auth/auth.type';
import { FindManyViewsQuery } from './dto';
import { SendViewDto } from './dto/send-view.dto';
import { ViewsReadService } from './services/views-read.service';
import { ViewsWriteService } from './services/views-write.service';
export declare class ViewsController {
    private readonly readService;
    private readonly writeService;
    constructor(readService: ViewsReadService, writeService: ViewsWriteService);
    send(payload: SendViewDto, clientData: ClientData): Promise<{
        type: string;
        data: import("../models").View;
    }>;
    findMany(queryParams: FindManyViewsQuery, clientData: ClientData): Promise<{
        type: string;
        data: import("../models").View[];
        pagination: import("../../types").Pagination;
    }>;
}
