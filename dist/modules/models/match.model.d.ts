import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { Match, MatchDocument, MatchWithTargetProfile } from './schemas/match.schema';
export declare class MatchModel extends CommonModel<Match> {
    readonly model: Model<MatchDocument>;
    constructor(model: Model<MatchDocument>);
    getSortedUserIds({ currentUserId, targetUserId, }: {
        currentUserId: string;
        targetUserId: string;
    }): {
        _userOneId: Types.ObjectId;
        _userTwoId: Types.ObjectId;
        isUserOne: boolean;
        sortedUserIds: string[];
        userOneId: string;
        userTwoId: string;
    };
    isUserOne({ currentUserId, userOneId, }: {
        currentUserId: string;
        userOneId: string;
    }): boolean;
    getTargetUserId({ currentUserId, userOneId, userTwoId, }: {
        currentUserId: string;
        userOneId: string;
        userTwoId: string;
    }): {
        _targetUserId: Types.ObjectId;
        isUserOne: boolean;
        targetUserId: string;
    };
    formatManyWithTargetProfile(matches: Match[], currentUserId: string): MatchWithTargetProfile[];
    formatOneWithTargetProfile(match: Match, isUserOne: boolean): MatchWithTargetProfile;
    queryUserOneOrUserTwo(_currentUserId: Types.ObjectId): {
        $or: ({
            'profileOne._id': Types.ObjectId;
            'profileTwo._id'?: undefined;
        } | {
            'profileTwo._id': Types.ObjectId;
            'profileOne._id'?: undefined;
        })[];
    };
}
