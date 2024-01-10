import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, QueryOptions } from 'mongoose';

import { ERROR_MESSAGES } from '../commons/messages';
import { CommonModel } from './bases/common-model';
import { Match } from './schemas';
import { View, ViewDocument } from './schemas/view.schema';

@Injectable()
export class ViewModel extends CommonModel<View> {
  constructor(
    @InjectModel(View.name)
    readonly model: Model<ViewDocument>,
  ) {
    super();
    this.notFoundMessage = ERROR_MESSAGES['View does not exist'];
    this.conflictMessage = ERROR_MESSAGES['View already exists'];
  }

  async deleteManyByUserId(
    _userId: mongoose.Types.ObjectId,
    options?: QueryOptions<Match>,
  ) {
    return this.model.deleteMany(
      { $or: [{ 'profile._id': _userId }, { 'targetProfile._id': _userId }] },
      options,
    );
  }
}
