import { Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApiCursorDateService } from '../../commons/services/api-cursor-date.service';
import { ChatsGateway } from '../chats/chats.gateway';
import { MessageModel, Profile, ProfileModel, TrashMatchModel, ViewModel } from '../models';
import { MatchModel } from '../models/match.model';
import { Match, MatchWithTargetProfile } from '../models/schemas/match.schema';
import { MatchesPublisher } from './matches.publisher';
export declare class MatchesHandler extends ApiCursorDateService {
    private readonly matchModel;
    private readonly chatsGateway;
    private readonly profileModel;
    private readonly messageModel;
    private readonly matchesPublisher;
    private readonly viewModel;
    private readonly trashMatchModel;
    constructor(matchModel: MatchModel, chatsGateway: ChatsGateway, profileModel: ProfileModel, messageModel: MessageModel, matchesPublisher: MatchesPublisher, viewModel: ViewModel, trashMatchModel: TrashMatchModel);
    logger: Logger;
    afterUnmatch({ currentUserId, match, }: {
        currentUserId: string;
        match: Match;
    }): Promise<void>;
    emitMatchToUser(userId: string, payload: MatchWithTargetProfile): void;
    emitUnMatchToUser(userId: string, payload: {
        _id: Types.ObjectId;
    }): void;
    handleAfterCreateMatch({ match, _currentUserId, }: {
        _currentUserId: Types.ObjectId;
        match: Match;
    }): Promise<void>;
    afterFindOneMatch({ match, profileOne, profileTwo, }: {
        match: Match;
        profileOne: Profile;
        profileTwo: Profile;
    }): Promise<void>;
}
