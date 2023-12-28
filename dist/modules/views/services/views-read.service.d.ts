import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { Pagination } from '../../../types';
import { PaginationCursorDateUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { View, ViewModel } from '../../models';
import { FindManyViewsQuery } from '../dto';
export declare class ViewsReadService extends ApiReadService<View, FindManyViewsQuery> {
    private readonly viewModel;
    private readonly paginationUtil;
    constructor(viewModel: ViewModel, paginationUtil: PaginationCursorDateUtil);
    findMany(queryParams: FindManyViewsQuery, client: ClientData): Promise<View[]>;
    getPagination(data: View[]): Pagination;
}
