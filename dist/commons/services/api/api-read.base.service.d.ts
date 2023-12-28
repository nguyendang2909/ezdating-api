import { ClientData } from '../../../modules/auth/auth.type';
import { Pagination } from '../../../types';
import { ApiBaseService } from './api.base.service';
export declare class ApiReadService<Entity extends object, QueryParams = Record<string, any>> extends ApiBaseService {
    protected limitRecordsPerQuery: number;
    findOneById(id: string, client: ClientData): Promise<Entity>;
    findMany(queryParams: QueryParams, client: ClientData | undefined): Promise<Entity[]>;
    getPagination(data: unknown[]): Pagination;
}
