import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { PaginatedResponse, Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { ProfileDocument, ProfileModel } from '../models';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import {
  Match,
  MatchDocument,
  MatchWithTargetUser,
} from '../models/schemas/match.schema';
import { UserModel } from '../models/user.model';
import { ViewModel } from '../models/view.model';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindManyMatchesQuery } from './dto/find-matches-relationships.dto';

@Injectable()
export class MatchesService extends ApiCursorDateService {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly userModel: UserModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly likeModel: LikeModel,
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.MATCHES;
  }

  private readonly logger = new Logger(MatchesService.name);

  public async createOne(
    payload: CreateMatchDto,
    clientData: ClientData,
  ): Promise<void> {
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
    const createdMatch = await this.createWithLog({ profileOne, profileTwo });
    this.handleAfterCreateMatch({ userOneId, userTwoId, match: createdMatch });
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
    await this.deleteOneByIdAndUserId(_id, _currentUserId);
    this.handleAfterUnmatch({
      currentUserId,
      userOneId: existMatch.profileOne._id.toString(),
      userTwoId: existMatch.profileTwo._id.toString(),
      _currentUserId,
      matchId: existMatch._id.toString(),
    });
    return {
      _id: existMatch._id,
    };
  }

  public async findMany(
    queryParams: FindManyMatchesQuery,
    clientData: ClientData,
  ): Promise<PaginatedResponse<MatchWithTargetUser>> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
    const findResults: Match[] = await this.matchModel.aggregate([
      {
        $match: {
          $or: [{ _userOneId: _currentUserId }, { _userTwoId: _currentUserId }],
          lastMessageAt: null,
          ...(cursor
            ? {
                createdAt: {
                  $lt: cursor,
                },
              }
            : {}),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      { $limit: APP_CONFIG.PAGINATION_LIMIT.MATCHES },
      {
        $set: {
          targetUser: { $first: '$targetUser' },
        },
      },
    ]);

    return {
      type: 'matches',
      data: this.matchModel.formatManyWithTargetProfile(
        findResults,
        currentUserId,
      ),
      pagination: this.getPagination(findResults),
    };
  }

  public getPagination(data: Match[]): Pagination {
    return this.getPaginationByField(data, 'createdAt');
  }

  public async findOneOrFailById(id: string, client: ClientData) {
    const { id: currentUserId } = client;
    const _currentUserId = this.getObjectId(currentUserId);
    const matches: Match[] = await this.matchModel.aggregate([
      {
        $match: {
          _id: this.getObjectId(id),
          $or: [
            {
              _userOneId: _currentUserId,
            },
            {
              _userTwoId: _currentUserId,
            },
          ],
        },
      },
      { $limit: 1 },
    ]);
    if (!matches[0]) {
      throw new NotFoundException(HttpErrorMessages['Match does not exist']);
    }
    const match = this.matchModel.formatOneWithTargetProfile(
      matches[0],
      currentUserId,
    );
    return match;
  }

  async handleAfterUnmatch({
    currentUserId,
    userOneId,
    userTwoId,
    _currentUserId,
    matchId,
  }: {
    _currentUserId: Types.ObjectId;
    currentUserId: string;
    matchId: string;
    userOneId: string;
    userTwoId: string;
  }) {
    const { _targetUserId } = this.matchModel.getTargetUserId({
      currentUserId,
      userOneId,
      userTwoId,
    });
    const deleteOwnLikePayload = {
      _userId: _currentUserId,
      _targetUserId,
    };
    this.logger.log(
      `UNMATCH Delete like from currentUser filter ${JSON.stringify(
        deleteOwnLikePayload,
      )}`,
    );
    this.likeModel.deleteOne(deleteOwnLikePayload).catch((error) => {
      this.logger.log(
        `UNMATCH Delete like failed filter ${JSON.stringify(
          deleteOwnLikePayload,
        )} with error: ${JSON.stringify(error)}`,
      );
    });
    const updateTargetLikeFilter = {
      _userId: _targetUserId,
      _targetUserId: _currentUserId,
    };
    const updateTargetLikePayload = {
      $set: {
        isMatched: false,
      },
    };
    this.logger.log(
      `UNMATCH Update like from targetUser filter: ${JSON.stringify(
        updateTargetLikeFilter,
      )} payload: ${JSON.stringify(updateTargetLikePayload)}`,
    );
    this.likeModel
      .updateOne(updateTargetLikeFilter, updateTargetLikePayload)
      .catch((error) => {
        this.logger.log(
          `UNMATCH Update like from targetUser failed filter: ${JSON.stringify(
            updateTargetLikeFilter,
          )} payload: ${JSON.stringify(
            updateTargetLikePayload,
          )} failed: ${JSON.stringify(error)}`,
        );
      });
    const emitRoomIds = [userOneId, userTwoId];
    this.logger.log(
      `UNMATCH Socket event ${
        SOCKET_TO_CLIENT_EVENTS.CANCEL_MATCH
      } to roomIds: ${emitRoomIds} payload: ${JSON.stringify(
        updateTargetLikePayload,
      )}`,
    );
    this.chatsGateway.server
      .to(emitRoomIds)
      .emit(SOCKET_TO_CLIENT_EVENTS.CANCEL_MATCH, {
        _id: matchId,
      });
  }

  async createWithLog({
    profileOne,
    profileTwo,
  }: {
    profileOne: ProfileDocument;
    profileTwo: ProfileDocument;
  }) {
    const createPayload = {
      profileOne,
      profileTwo,
    };
    this.logger.log(
      `CREATE_MATCH Start create match with payload: ${JSON.stringify(
        createPayload,
      )}`,
    );
    return await this.matchModel.createOne(createPayload);
  }

  emitMatchToUser(userId: string, payload: MatchWithTargetUser) {
    this.logger.log(
      `SOCKET_EVENT Emit "${
        SOCKET_TO_CLIENT_EVENTS.MATCH
      }" userId: ${JSON.stringify(userId)} payload: ${JSON.stringify(payload)}`,
    );
    this.chatsGateway.server
      .to(userId)
      .emit(SOCKET_TO_CLIENT_EVENTS.MATCH, payload);
  }

  async deleteOneByIdAndUserId(_id: Types.ObjectId, _userId: Types.ObjectId) {
    const deletePayload = {
      $or: [{ _userOneId: _userId }, { _userTwoId: _userId }],
    };
    this.logger.log(`UNMATCH payload: ${JSON.stringify(deletePayload)}`);
    await this.matchModel.deleteOneOrFail(deletePayload);
  }

  handleAfterCreateMatch({
    userOneId,
    userTwoId,
    match,
  }: {
    match: MatchDocument;
    userOneId: string;
    userTwoId: string;
  }) {
    const { profileOne, profileTwo, ...restCreatedMatch } = match;
    this.emitMatchToUser(userOneId, {
      ...restCreatedMatch,
      targetProfile: profileTwo,
    });
    this.emitMatchToUser(userTwoId, {
      ...restCreatedMatch,
      targetProfile: profileOne,
    });
  }
}
