import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ApiWriteService } from '../../../commons';
import { LikesHandler } from '../../../handlers/likes.handler';
import { MatchModel, ProfileModel, View, ViewModel } from '../../../models';
import { MatchesUtil, ProfilesUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { SendLikeDto } from '../dto/send-like.dto';

@Injectable()
export class LikesWriteService extends ApiWriteService<View, SendLikeDto> {
  constructor(
    private readonly matchModel: MatchModel,
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
    private readonly likesHandler: LikesHandler,
    private readonly matchesUtil: MatchesUtil,
    private readonly profilesUtil: ProfilesUtil,
  ) {
    super();
  }

  public async createOne(
    payload: SendLikeDto,
    clientData: ClientData,
  ): Promise<View> {
    const { targetUserId } = payload;
    const { _currentUserId, currentUserId } = this.getClient(clientData);
    this.profilesUtil.verifyNotSameById(currentUserId, targetUserId);
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
    const isUserOne = this.matchesUtil.isUserOne({
      currentUserId,
      userOneId: profileOne._id.toString(),
    });
    const view = await this.viewModel.findOneAndUpdate(
      { 'profile._id': _targetUserId, 'targetProfile._id': _currentUserId },
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
}
