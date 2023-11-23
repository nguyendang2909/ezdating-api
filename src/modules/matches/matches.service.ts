import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';

import { APP_CONFIG } from '../../app.config';
import { ApiCursorDateService } from '../../commons';
import { Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { ProfileModel } from '../models';
import { MatchModel } from '../models/match.model';
import { Match, MatchWithTargetProfile } from '../models/schemas/match.schema';
import { CreateMatchDto, FindManyMatchesQuery } from './dto';
import { MatchesHandler } from './matches.handler';

@Injectable()
export class MatchesService extends ApiCursorDateService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly profileModel: ProfileModel,
    private readonly matchesHandler: MatchesHandler,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.MATCHES;
  }

  private readonly logger = new Logger(MatchesService.name);

  public async createOne(
    payload: CreateMatchDto,
    clientData: ClientData,
  ): Promise<MatchWithTargetProfile> {
    const { _currentUserId } = this.getClient(clientData);
    const { targetUserId } = payload;
    const _targetUserId = this.getObjectId(targetUserId);

    const { profileOne, profileTwo } =
      await this.profileModel.findTwoOrFailPublicByIds(
        _currentUserId,
        _targetUserId,
      );
    await this.matchModel.findOneAndFail({
      'profileOne._id': profileOne._id,
      'profileTwo._id': profileTwo._id,
    });
    const createdMatch = await this.matchModel.createOne({
      profileOne,
      profileTwo,
    });
    this.matchesHandler.handleAfterCreateMatch({
      match: createdMatch,
      _currentUserId,
    });
    const restCreatedMatch = _.omit(createdMatch, ['profileOne', 'profileTwo']);
    return {
      ...restCreatedMatch,
      targetProfile:
        profileOne._id.toString() === targetUserId ? profileOne : profileTwo,
    };
  }

  public async unmatch(id: string, clientData: ClientData) {
    const _id = this.getObjectId(id);
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const existMatch = await this.matchModel.findOneOrFail({
      _id,
      $or: [
        { 'profileOne._id': _currentUserId },
        { 'profileTwo._id': _currentUserId },
      ],
    });
    await this.matchModel.deleteOneOrFail({
      _id,
      ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
    });
    this.matchesHandler.afterUnmatch({
      match: existMatch,
      currentUserId,
    });
    return {
      _id: existMatch._id,
    };
  }

  public async findMany(
    queryParams: FindManyMatchesQuery,
    clientData: ClientData,
  ): Promise<MatchWithTargetProfile[]> {
    const { _currentUserId, currentUserId } = this.getClient(clientData);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
    const findResults = await this.matchModel.findMany(
      {
        ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
        lastMessage: { $exists: false },
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
    return this.matchModel.formatManyWithTargetProfile(
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
    const isUserOne = this.matchModel.isUserOne({
      currentUserId,
      userOneId: match.profileOne._id.toString(),
    });
    const { profileOne, profileTwo } =
      await this.profileModel.findTwoOrFailPublicByIds(
        match.profileOne._id,
        match.profileTwo._id,
      );
    this.matchesHandler.afterFindOneMatch({ match, profileOne, profileTwo });
    return {
      ..._.omit(match, ['profileOne', 'profileTwo']),
      targetProfile: isUserOne ? profileTwo : profileOne,
    };
  }

  async findOneByTargetUserId(targetUserId: string, client: ClientData) {
    const { _userOneId, _userTwoId, isUserOne } =
      this.matchModel.getSortedUserIds({
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
    this.matchesHandler.afterFindOneMatch({ match, profileOne, profileTwo });
    return {
      ..._.omit(match, ['profileOne', 'profileTwo']),
      targetProfile: isUserOne ? profileTwo : profileOne,
    };
  }

  public getPagination(
    data: Array<Match | MatchWithTargetProfile>,
  ): Pagination {
    return this.getPaginationByField(data, 'createdAt');
  }
}
