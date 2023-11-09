import { BadRequestException, Injectable } from '@nestjs/common';

import { APP_CONFIG } from '../../app.config';
import { ApiCursorDateService } from '../../commons';
import { ERROR_MESSAGES } from '../../commons/messages';
import { PaginatedResponse } from '../../types';
import { ClientData } from '../auth/auth.type';
import { MatchModel, ProfileModel, View } from '../models';
import { ViewModel } from '../models/view.model';
import { FindManyViewsQuery } from './dto';
import { SendViewDto } from './dto/send-view.dto';

@Injectable()
export class ViewsService extends ApiCursorDateService {
  constructor(
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
    private readonly matchModel: MatchModel,
  ) {
    super();
    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.VIEWS;
  }

  public async send(
    payload: SendViewDto,
    clientData: ClientData,
  ): Promise<View> {
    const { currentUserId, _currentUserId } = this.getClient(clientData);
    const { targetUserId } = payload;
    this.verifyNotSameUserById(currentUserId, targetUserId);
    const _targetUserId = this.getObjectId(targetUserId);
    await this.viewModel.findOneAndFail({
      'profile._id': _currentUserId,
      'targetProfile._id': _targetUserId,
    });
    const { profileOne, profileTwo } =
      await this.profileModel.findTwoOrFailPublicByIds(
        _currentUserId,
        _targetUserId,
      );
    const isUserOne = this.matchModel.isUserOne({
      currentUserId,
      userOneId: profileOne._id.toString(),
    });
    const view = await this.viewModel.createOne({
      profile: isUserOne ? profileOne : profileTwo,
      targetProfile: isUserOne ? profileTwo : profileOne,
    });
    return view;
  }

  public async findMany(
    queryParams: FindManyViewsQuery,
    client: ClientData,
  ): Promise<PaginatedResponse<View>> {
    const { _currentUserId } = this.getClient(client);
    const { _next } = queryParams;
    const cursor = _next ? this.getCursor(_next) : undefined;
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
    return {
      type: 'views',
      data: findResults,
      pagination: this.getPagination(findResults),
    };
  }

  verifyNotSameUserById(userOne: string, userTwo: string) {
    if (userOne === userTwo) {
      throw new BadRequestException({
        message: ERROR_MESSAGES['You cannot view yourself'],
      });
    }
  }
}
