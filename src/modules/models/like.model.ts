import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
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

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.LIKES;
    this.conflictMessage = ERROR_MESSAGES['Like already exists'];
    this.notFoundMessage = ERROR_MESSAGES['Like does not exist'];
  }

  async findOneOrFail(
    filter: FilterQuery<Like>,
    projection?: ProjectionType<Like> | null | undefined,
    options?: QueryOptions<Like> | null | undefined,
  ) {
    const findResult = await this.findOne(filter, projection, options);
    if (!findResult) {
      throw new NotFoundException(ERROR_MESSAGES['Like does not exist']);
    }
    return findResult;
  }
}
