import { Injectable, Logger } from '@nestjs/common';

import { APP_CONFIG } from '../../app.config';
import { ApiCursorDateService } from '../../commons';
import { PaginatedResponse, Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { ProfileModel } from '../models';
import { MatchModel } from '../models/match.model';
import {
  Match,
  MatchDocument,
  MatchWithTargetProfile,
} from '../models/schemas/match.schema';
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
  ): Promise<MatchDocument> {
    const { targetUserId } = payload;
    const { id: currentUserId } = clientData;
    const { _userOneId, _userTwoId, userOneId, userTwoId } =
      this.matchModel.getSortedUserIds({
        currentUserId,
        targetUserId,
      });
    const [profileOne, profileTwo] =
      await this.profileModel.findTwoOrFailMatchProfiles(
        _userOneId,
        _userTwoId,
      );
    await this.matchModel.findOneAndFail({
      'profileOne._id': _userOneId,
      'profileTwo._id': _userTwoId,
    });
    const createdMatch = await this.matchModel.createOne({
      profileOne,
      profileTwo,
    });
    this.matchesHandler.handleAfterCreateMatch({
      userOneId,
      userTwoId,
      match: createdMatch,
    });
    return createdMatch;
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
    this.matchesHandler.handleAfterUnmatch({
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
  ): Promise<PaginatedResponse<MatchWithTargetProfile>> {
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
    return {
      type: 'matches',
      data: this.matchModel.formatManyWithTargetProfile(
        findResults,
        currentUserId,
      ),
      pagination: this.getPagination(findResults),
    };
  }

  public async findOneOrFailById(id: string, client: ClientData) {
    const { id: currentUserId } = client;
    const _currentUserId = this.getObjectId(currentUserId);
    const { profileOne, profileTwo, ...restMatch } =
      await this.matchModel.findOneOrFail({
        _id: this.getObjectId(id),
        ...this.matchModel.queryUserOneOrUserTwo(_currentUserId),
      });
    const isUserOne = this.matchModel.isUserOne({
      currentUserId,
      userOneId: profileOne._id.toString(),
    });
    const targetProfile = await this.profileModel.findOneOrFailById(
      isUserOne ? profileTwo._id : profileOne._id,
    );

    return { ...restMatch, targetProfile };
  }

  public getPagination(data: Match[]): Pagination {
    return this.getPaginationByField(data, 'createdAt');
  }
}
