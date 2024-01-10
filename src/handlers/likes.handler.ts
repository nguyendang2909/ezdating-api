import { Injectable, Logger } from '@nestjs/common';

import { PushNotificationsService } from '../api/push-notifications/push-notifications.service';
import { APP_CONFIG } from '../app.config';
import { ChatsGateway } from '../chats/chats.gateway';
import { MatchModel, Profile, ProfileModel, ViewModel } from '../models';
import { MatchesUtil } from '../utils';
import { MatchesSocketEventHandler } from './events';

@Injectable()
export class LikesHandler {
  constructor(
    private readonly chatsGateway: ChatsGateway,
    private readonly matchModel: MatchModel,
    private readonly viewModel: ViewModel,
    private readonly profileModel: ProfileModel,
    private readonly pushNotificationsService: PushNotificationsService,
    private readonly matchesUtil: MatchesUtil,
    private readonly matchesSocketEventHandler: MatchesSocketEventHandler,
  ) {}

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
      this.matchesSocketEventHandler.emitMatchToUser(
        profileOne._id.toString(),
        this.matchesUtil.formatOneWithTargetProfile(createdMatch, true),
      );
      this.matchesSocketEventHandler.emitMatchToUser(
        profileTwo._id.toString(),
        this.matchesUtil.formatOneWithTargetProfile(createdMatch, false),
      );
      // Push notification
      const isUserOne = this.matchesUtil.isUserOne({
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
}
