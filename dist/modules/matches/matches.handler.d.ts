import { Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChatsGateway } from '../chats/chats.gateway';
import { Profile, ProfileModel, TrashMatchModel, ViewModel } from '../models';
import { MatchModel } from '../models/match.model';
import { Match, MatchWithTargetProfile } from '../models/schemas/match.schema';
export declare class MatchesHandler {
    private readonly matchModel;
    private readonly chatsGateway;
    private readonly profileModel;
    private readonly viewModel;
    private readonly trashMatchModel;
    constructor(matchModel: MatchModel, chatsGateway: ChatsGateway, profileModel: ProfileModel, viewModel: ViewModel, trashMatchModel: TrashMatchModel);
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
