import { ClientData } from '../auth/auth.type';
import { FindManyViewsQuery } from './dto';
import { SendViewDto } from './dto/send-view.dto';
import { ViewsService } from './views.service';
export declare class ViewsController {
    private readonly service;
    constructor(service: ViewsService);
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
