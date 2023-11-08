import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ERROR_MESSAGES } from '../../commons/messages/error-messages.constant';
import { CommonModel } from './bases/common-model';
import { Like, LikeDocument } from './schemas/like.schema';

@Injectable()
export class LikeModel extends CommonModel<Like> {
  constructor(
    @InjectModel(Like.name)
    readonly model: Model<LikeDocument>,
  ) {
    super();
    this.conflictMessage = ERROR_MESSAGES['Like already exists'];
    this.notFoundMessage = ERROR_MESSAGES['Like does not exist'];
  }
}
