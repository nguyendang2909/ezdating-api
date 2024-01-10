import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, QueryOptions } from 'mongoose';

import { ERROR_MESSAGES } from '../commons/messages';
import { CommonModel } from './bases/common-model';
import { Match } from './schemas';
import { Message, MessageDocument } from './schemas/message.schema';
import { UserModel } from './user.model';

@Injectable()
export class MessageModel extends CommonModel<Message> {
  constructor(
    @InjectModel(Message.name)
    readonly model: Model<MessageDocument>,
    private readonly userModel: UserModel,
  ) {
    super();
    this.conflictMessage = ERROR_MESSAGES['Message already exists'];
    this.notFoundMessage = ERROR_MESSAGES['Message does not exist'];
  }

  async deleteManyByMatchId(
    _matchId: mongoose.Types.ObjectId,
    options?: QueryOptions<Message>,
  ) {
    return await this.deleteMany({ _matchId }, options);
  }

  async deleteManyByMatchIds(
    _matchIds: mongoose.Types.ObjectId[],
    options?: QueryOptions<Message>,
  ) {
    return await this.deleteMany({ _matchId: { $in: _matchIds } }, options);
  }

  async deleteManyByMatches(matches: Match[], options?: QueryOptions<Message>) {
    return await this.deleteManyByMatchIds(
      matches.map((e) => e._id),
      options,
    );
  }
}
