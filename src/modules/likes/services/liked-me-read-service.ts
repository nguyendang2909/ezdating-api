import { Injectable } from '@nestjs/common';
import moment from 'moment';

import { APP_CONFIG } from '../../../app.config';
import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { Pagination } from '../../../types';
import { PaginationCursorDateUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { ProfileFilterModel, View, ViewModel } from '../../models';
import { FindManyLikedMeQuery } from '../dto/find-user-like-me.dto';

@Injectable()
export class LikedMeReadService extends ApiReadService<View> {
  constructor(
    private readonly viewModel: ViewModel,
    protected readonly profileFilterModel: ProfileFilterModel,
    protected readonly paginationUtil: PaginationCursorDateUtil,
  ) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.LIKES;
  }

  async findOneById(id: string, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    const like = await this.viewModel.findOneOrFail([
      {
        $match: {
          _id: this.getObjectId(id),
          'targetProfile._id': _currentUserId,
        },
      },
    ]);
    return like;
  }

  public async findMany(
    queryParams: FindManyLikedMeQuery,
    client: ClientData,
  ): Promise<View[]> {
    const { _currentUserId } = this.getClient(client);
    const { _next } = queryParams;
    const cursor = _next ? this.paginationUtil.getCursor(_next) : undefined;
    const filterProfile = await this.profileFilterModel.findOneOrFail({
      _id: _currentUserId,
    });
    const findResults = await this.viewModel.findMany(
      {
        'targetProfile._id': _currentUserId,
        ...(cursor ? { createdAt: { $lt: cursor } } : {}),
        'profile.birthday': {
          $gte: moment().subtract(filterProfile.maxAge, 'years').toDate(),
          $lte: moment().subtract(filterProfile.minAge, 'years').toDate(),
        },
        isLiked: true,
        isMatched: false,
        'profile.gender': filterProfile.gender,
      },
      {},
      {
        sort: { createdAt: -1 },
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
