import { Injectable, Logger } from '@nestjs/common';

import { APP_CONFIG } from '../../app.config';
import { ChatsGateway } from '../../chats/chats.gateway';
import { ApiBaseService } from '../../commons';
import { SOCKET_TO_CLIENT_EVENTS } from '../../constants';
import { MatchWithTargetProfile, Profile, ProfileModel } from '../models';
import { MatchModel } from '../models/match.model';
import { ViewModel } from '../models/view.model';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';

@Injectable()
export class LikesHandler extends ApiBaseService {
  constructor(
    private readonly chatsGateway: ChatsGateway,
    private readonly matchModel: MatchModel,
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
    private readonly pushNotificationsService: PushNotificationsService,
  ) {
    super();
  }

  logger = new Logger(LikesHandler.name);

  async afterSendLike({
    hasReverseLike,
    profileOne,
    profileTwo,
    currentUserId,
  }: {
    currentUserId: string;
    hasReverseLike: boolean;
    profileOne: Profile;
    profileTwo: Profile;
  }) {
    if (hasReverseLike) {
      const createdMatch = await this.matchModel.createOne({
        profileOne,
        profileTwo,
      });
      this.emitMatchToUser(
        profileOne._id.toString(),
        this.matchModel.formatOneWithTargetProfile(createdMatch, true),
      );
      this.emitMatchToUser(
        profileTwo._id.toString(),
        this.matchModel.formatOneWithTargetProfile(createdMatch, false),
      );
      // Push notification
      const isUserOne = this.matchModel.isUserOne({
        currentUserId,
        userOneId: profileOne._id.toString(),
      });
      const currentProfile = isUserOne ? profileOne : profileTwo;
      const targetProfile = isUserOne ? profileTwo : profileOne;
      this.pushNotificationsService.sendByProfile(targetProfile, {
        content: `You have match with ${currentProfile.nickname}`,
        title: APP_CONFIG.APP_TITLE,
      });
    }
  }

  emitMatchToUser(userId: string, payload: MatchWithTargetProfile) {
    this.logger.log(
      `SOCKET_EVENT Emit "${
        SOCKET_TO_CLIENT_EVENTS.MATCH
      }" userId: ${JSON.stringify(userId)} payload: ${JSON.stringify(payload)}`,
    );
    this.chatsGateway.server
      .to(userId)
      .emit(SOCKET_TO_CLIENT_EVENTS.MATCH, payload);
  }
}
