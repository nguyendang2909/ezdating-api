import { Logger } from '@nestjs/common';
import { DbService } from '../../commons';
import { ChatsGateway } from '../chats/chats.gateway';
import { MatchWithTargetProfile, Profile, ProfileModel } from '../models';
import { MatchModel } from '../models/match.model';
import { ViewModel } from '../models/view.model';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
export declare class LikesHandler extends DbService {
    private readonly chatsGateway;
    private readonly matchModel;
    private readonly viewModel;
    private readonly profileModel;
    private readonly pushNotificationsService;
    constructor(chatsGateway: ChatsGateway, matchModel: MatchModel, viewModel: ViewModel, profileModel: ProfileModel, pushNotificationsService: PushNotificationsService);
    logger: Logger;
    afterSendLike({ hasReverseLike, profileOne, profileTwo, currentUserId, }: {
        currentUserId: string;
        hasReverseLike: boolean;
        profileOne: Profile;
        profileTwo: Profile;
    }): Promise<void>;
    emitMatchToUser(userId: string, payload: MatchWithTargetProfile): void;
}
