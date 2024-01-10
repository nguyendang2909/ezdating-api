import { BadRequestException, Injectable } from '@nestjs/common';

import { ApiWriteService } from '../../../commons';
import { ERROR_MESSAGES } from '../../../commons/messages';
import { MatchModel, ProfileModel, View, ViewModel } from '../../../models';
import { MatchesUtil } from '../../../utils';
import { ClientData } from '../../auth/auth.type';
import { SendViewDto } from '../dto';

@Injectable()
export class ViewsWriteService extends ApiWriteService<View, SendViewDto> {
  constructor(
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
    private readonly matchModel: MatchModel,
    private readonly matchesUtil: MatchesUtil,
  ) {
    super();
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
    const isUserOne = this.matchesUtil.isUserOne({
      currentUserId,
      userOneId: profileOne._id.toString(),
    });
    const view = await this.viewModel.createOne({
      profile: isUserOne ? profileOne : profileTwo,
      targetProfile: isUserOne ? profileTwo : profileOne,
    });
    return view;
  }

  verifyNotSameUserById(userOne: string, userTwo: string) {
    if (userOne === userTwo) {
      throw new BadRequestException({
        message: ERROR_MESSAGES['You cannot view yourself'],
      });
    }
  }
}
