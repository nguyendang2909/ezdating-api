import { BadRequestException, Injectable } from '@nestjs/common';

import { ERROR_MESSAGES } from '../../commons/messages';
import { ApiService } from '../../commons/services/api.service';
import { ClientData } from '../auth/auth.type';
import { MatchModel, ProfileModel, View } from '../models';
import { ViewModel } from '../models/view.model';
import { SendViewDto } from './dto/send-view.dto';

@Injectable()
export class ViewsService extends ApiService {
  constructor(
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
    private readonly matchModel: MatchModel,
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
    const { profileOne, profileTwo } =
      await this.profileModel.findTwoOrFailPublicByIds(
        _currentUserId,
        _targetUserId,
      );
    await this.viewModel.findOneAndFail({
      'profile._id': _currentUserId,
      'targetProfile._id': _targetUserId,
    });
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

  verifyNotSameUserById(userOne: string, userTwo: string) {
    if (userOne === userTwo) {
      throw new BadRequestException({
        message: ERROR_MESSAGES['You cannot view yourself'],
      });
    }
  }
}
