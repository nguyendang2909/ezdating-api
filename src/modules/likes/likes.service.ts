import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';

import { APP_CONFIG } from '../../app.config';
import { ERROR_MESSAGES } from '../../commons/messages/error-messages.constant';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { PaginatedResponse, Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { ProfileFilterModel, ProfileModel } from '../models';
import { LikeModel } from '../models/like.model';
import { MatchModel } from '../models/match.model';
import { Like, LikeDocument } from '../models/schemas/like.schema';
import { ViewModel } from '../models/view.model';
import { FindManyLikedMeDto } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';
import { LikesHandler } from './likes.handler';

@Injectable()
export class LikesService extends ApiCursorDateService {
  constructor(
    private readonly likeModel: LikeModel,
    private readonly chatsGateway: ChatsGateway,
    private readonly matchModel: MatchModel,
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
    private readonly likesHandler: LikesHandler,
    private readonly profileFilterModel: ProfileFilterModel,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.LIKES;
  }

  private readonly logger = new Logger(LikesService.name);

  public async send(
    payload: SendLikeDto,
    clientData: ClientData,
  ): Promise<Like> {
    const { targetUserId } = payload;
    const { _currentUserId, currentUserId } = this.getClient(clientData);
    this.verifyNotSameUserById(currentUserId, targetUserId);
    const _targetUserId = this.getObjectId(targetUserId);
    const { profileOne, profileTwo } =
      await this.profileModel.findTwoOrFailPublicByIds(
        _currentUserId,
        _targetUserId,
      );
    await this.likeModel.findOneAndFail({
      'profile._id': _currentUserId,
      'targetProfile._id': _targetUserId,
    });
    const reverseLike = await this.likeModel.findOneAndUpdate(
      {
        'profile._id': _targetUserId,
        'targetProfile._id': _currentUserId,
      },
      {
        $set: {
          isMatched: true,
        },
      },
    );
    const isUserOne = this.matchModel.isUserOne({
      currentUserId,
      userOneId: profileOne._id.toString(),
    });
    const like = await this.likeModel.createOne({
      profile: isUserOne ? profileOne : profileTwo,
      targetProfile: isUserOne ? profileTwo : profileOne,
      ...(reverseLike ? { isMatched: true } : {}),
    });
    this.likesHandler.afterSendLike({
      like,
      hasReverseLike: !!reverseLike,
      profileOne,
      profileTwo,
      currentUserId,
    });
    return like;
  }

  public async findManyLikedMe(
    queryParams: FindManyLikedMeDto,
    clientData: ClientData,
  ): Promise<PaginatedResponse<Like>> {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
    const filterProfile = await this.profileFilterModel.findOneOrFail({
      _id: _currentUserId,
    });
    const findResults = await this.likeModel.findMany(
      {
        'targetProfile._id': _currentUserId,
        isMatched: false,
        'profile.mediaFileCount': { $gt: 0 },
        'profile.gender': filterProfile.gender,
        'profile.birthday': {
          $gte: moment().subtract(filterProfile.maxAge, 'years').toDate(),
          $lte: moment().subtract(filterProfile.minAge, 'years').toDate(),
        },
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
      type: 'likedMe',
      data: findResults,
      pagination: this.getPagination(findResults),
    };
  }

  async findOneLikeMeById(id: string, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    const _id = this.getObjectId(id);
    const [like] = await this.likeModel.aggregate([
      { $match: { _id, 'targetProfile._id': _currentUserId } },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'profiles',
          let: {
            profileId: '$profile._id',
          },
          as: 'profile',
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$profileId'],
                },
              },
            },
            {
              $limit: 1,
            },
            {
              $project: this.profileModel.publicFields,
            },
          ],
        },
      },
      {
        $set: {
          profile: { $first: '$profile' },
        },
      },
    ]);
    if (!like || !like.profile) {
      throw new NotFoundException(ERROR_MESSAGES['Like does not exist']);
    }
    return like;
  }

  public getPagination(data: LikeDocument[]): Pagination {
    return this.getPaginationByField(data, 'createdAt');
  }

  public verifyNotSameUserById(userOne: string, userTwo: string) {
    if (userOne === userTwo) {
      throw new BadRequestException({
        message: ERROR_MESSAGES['You cannot like yourself'],
      });
    }
  }
}
