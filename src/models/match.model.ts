import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { ERROR_MESSAGES } from '../commons/messages/error-messages.constant';
import { CommonModel } from './bases/common-model';
import { Match, MatchDocument } from './schemas/match.schema';

@Injectable()
export class MatchModel extends CommonModel<Match> {
  constructor(
    @InjectModel(Match.name)
    readonly model: Model<MatchDocument>,
  ) {
    super();
    this.conflictMessage = ERROR_MESSAGES['Match already exists'];
    this.notFoundMessage = ERROR_MESSAGES['Match does not exist'];
  }

  queryUserOneOrUserTwo(_currentUserId: Types.ObjectId) {
    return {
      $or: [
        { 'profileOne._id': _currentUserId },
        { 'profileTwo._id': _currentUserId },
      ],
    };
  }
}
