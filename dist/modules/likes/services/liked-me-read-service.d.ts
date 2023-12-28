import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { Pagination } from '../../../types';
import { PaginationCursorDateUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { ProfileFilterModel, View, ViewModel } from '../../models';
import { FindManyLikedMeQuery } from '../dto/find-user-like-me.dto';
export declare class LikedMeReadService extends ApiReadService<View> {
    private readonly viewModel;
    protected readonly profileFilterModel: ProfileFilterModel;
    protected readonly paginationUtil: PaginationCursorDateUtil;
    constructor(viewModel: ViewModel, profileFilterModel: ProfileFilterModel, paginationUtil: PaginationCursorDateUtil);
    findOneById(id: string, client: ClientData): Promise<View>;
    findMany(queryParams: FindManyLikedMeQuery, client: ClientData): Promise<View[]>;
    getPagination(data: View[]): Pagination;
}
