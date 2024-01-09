import { Injectable } from '@nestjs/common';

import { APP_CONFIG } from '../../../app.config';
import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { Pagination } from '../../../types';
import { PaginationCursorDateUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { View, ViewModel } from '../../models';
import { FindManyViewsQuery } from '../dto';

@Injectable()
export class ViewsReadService extends ApiReadService<View, FindManyViewsQuery> {
  constructor(
    private readonly viewModel: ViewModel,
    private readonly paginationUtil: PaginationCursorDateUtil,
  ) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.VIEWS;
  }

  public async findMany(
    queryParams: FindManyViewsQuery,
    client: ClientData,
  ): Promise<View[]> {
    const { _currentUserId } = this.getClient(client);
    const { _next } = queryParams;
    const cursor = _next ? this.paginationUtil.getCursor(_next) : undefined;
    const findResults = await this.viewModel.findMany(
      {
        'profile._id': _currentUserId,
        isLiked: false,
        isMatched: false,
        ...(cursor
          ? {
              createdAt: {
                $lt: cursor,
              },
            }
          : {}),
      },
      {},
      {
        sort: {
          createdAt: -1,
        },
        limit: this.limitRecordsPerQuery,
      },
    );
    return findResults;
  }

  public getPagination(data: View[]): Pagination {
    return this.paginationUtil.getPaginationByField(
      data,
      'createdAt',
      this.limitRecordsPerQuery,
    );
  }
}
