import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import moment from 'moment';

import { APP_CONFIG } from '../../app.config';
import { ERROR_MESSAGES } from '../../commons/messages/error-messages.constant';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { ChatsGateway } from '../chats/chats.gateway';
import { ProfileFilterModel, ProfileModel, View } from '../models';
import { MatchModel } from '../models/match.model';
import { ViewModel } from '../models/view.model';
import { FindManyLikedMeDto } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';
import { LikesHandler } from './likes.handler';

@Injectable()
export class LikesService extends ApiCursorDateService {
  constructor(
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

  logger = new Logger(LikesService.name);

  public async send(
    payload: SendLikeDto,
    clientData: ClientData,
  ): Promise<View> {
    const { targetUserId } = payload;
    const { _currentUserId, currentUserId } = this.getClient(clientData);
    this.verifyNotSameUserById(currentUserId, targetUserId);
    const _targetUserId = this.getObjectId(targetUserId);
    const { profileOne, profileTwo } =
      await this.profileModel.findTwoOrFailPublicByIds(
        _currentUserId,
        _targetUserId,
      );
    await this.viewModel.findOneAndFail({
      'profile._id': _currentUserId,
      'targetProfile._id': _targetUserId,
      isLiked: true,
    });
    const reverseLike = await this.viewModel.findOneAndUpdate(
      {
        'profile._id': _targetUserId,
        'targetProfile._id': _currentUserId,
        isLiked: true,
      },
      { $set: { isMatched: true } },
    );
    const isUserOne = this.matchModel.isUserOne({
      currentUserId,
      userOneId: profileOne._id.toString(),
    });
    const view = await this.viewModel.findOneAndUpdate(
      {
        'profile._id': _targetUserId,
        'targetProfile._id': _currentUserId,
      },
      {
        $set: {
          profile: isUserOne ? profileOne : profileTwo,
          targetProfile: isUserOne ? profileTwo : profileOne,
          isLiked: true,
          ...(reverseLike ? { isMatched: true } : {}),
        },
      },
      { upsert: true, new: true },
    );
    if (!view) {
      throw new InternalServerErrorException();
    }
    this.likesHandler.afterSendLike({
      hasReverseLike: !!reverseLike,
      profileOne,
      profileTwo,
      currentUserId,
    });
    return view;
  }

  public async findManyLikedMe(
    queryParams: FindManyLikedMeDto,
    clientData: ClientData,
  ) {
    const { id: currentUserId } = clientData;
    const _currentUserId = this.getObjectId(currentUserId);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
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

  async findOneLikeMeById(id: string, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    const _id = this.getObjectId(id);
    const like = await this.viewModel.findOneOrFail([
      { $match: { _id, 'targetProfile._id': _currentUserId } },
    ]);
    return like;
  }

  public getPagination(data: View[]): Pagination {
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
