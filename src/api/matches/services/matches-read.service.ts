import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { APP_CONFIG } from '../../../app.config';
import { ApiReadService } from '../../../commons/services/api/api-read.base.service';
import { MatchesHandler } from '../../../handlers/matches.handler';
import {
  Match,
  MatchModel,
  MatchWithTargetProfile,
  ProfileModel,
} from '../../../models';
import { Pagination } from '../../../types';
import { MatchesUtil, PaginationCursorDateUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { FindManyMatchesQuery } from '../dto';

@Injectable()
export class MatchesReadService extends ApiReadService<
  Match | MatchWithTargetProfile,
  FindManyMatchesQuery
> {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly profileModel: ProfileModel,
    private readonly matchesHandler: MatchesHandler,
    protected readonly paginationUtil: PaginationCursorDateUtil,
    private readonly matchesUtil: MatchesUtil,
  ) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.MATCHES;
  }

  public async findMany(
    queryParams: FindManyMatchesQuery,
    clientData: ClientData,
  ): Promise<MatchWithTargetProfile[]> {
    const { _currentUserId, currentUserId } = this.getClient(clientData);
    const { _next } = queryParams;
    const cursor = _next ? this.paginationUtil.getCursor(_next) : undefined;
    const findResults = await this.matchModel.findMany(
      {
        ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
        lastMessage: { $exists: false },
        ...(cursor ? { createdAt: { $lt: cursor } } : {}),
      },
      {},
      { sort: { createdAt: -1 }, limit: this.limitRecordsPerQuery },
    );
    return this.matchesUtil.formatManyWithTargetProfile(
      findResults,
      currentUserId,
    );
  }

  public async findOneOrFailById(id: string, client: ClientData) {
    const { _currentUserId, currentUserId } = this.getClient(client);
    const _id = this.getObjectId(id);
    const match = await this.matchModel.findOneOrFail({
      _id,
      ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
    });
    const isUserOne = this.matchesUtil.isUserOne({
      currentUserId,
      userOneId: match.profileOne._id.toString(),
    });
    const { profileOne, profileTwo } =
      await this.profileModel.findTwoOrFailPublicByIds(
        match.profileOne._id,
        match.profileTwo._id,
      );
    this.matchesHandler.handleAfterFindOneMatch({
      match,
      profileOne,
      profileTwo,
    });
    return {
      ..._.omit(match, ['profileOne', 'profileTwo']),
      targetProfile: isUserOne ? profileTwo : profileOne,
    };
  }

  async findOneByTargetUserId(targetUserId: string, client: ClientData) {
    const { _userOneId, _userTwoId, isUserOne } =
      this.matchesUtil.getSortedUserIds({
        currentUserId: client.id,
        targetUserId,
      });
    const [{ profileOne, profileTwo }, match] = await Promise.all([
      this.profileModel.findTwoOrFailPublicByIds(_userOneId, _userTwoId),
      this.matchModel.findOneOrFail({
        'profileOne._id': _userOneId,
        'profileTwo._id': _userTwoId,
      }),
    ]);
    this.matchesHandler.handleAfterFindOneMatch({
      match,
      profileOne,
      profileTwo,
    });
    return {
      ..._.omit(match, ['profileOne', 'profileTwo']),
      targetProfile: isUserOne ? profileTwo : profileOne,
    };
  }

  public getPagination(
    data: Array<Match | MatchWithTargetProfile>,
  ): Pagination {
    return this.paginationUtil.getPaginationByField(
      data,
      'createdAt',
      this.limitRecordsPerQuery,
    );
  }
}
