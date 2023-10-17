import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { APP_CONFIG } from '../../app.config';
import { CommonModel } from './common-model';
import { Like, LikeDocument } from './schemas/like.schema';

@Injectable()
export class LikeModel extends CommonModel {
  constructor(
    @InjectModel(Like.name)
    public readonly model: Model<LikeDocument>,
  ) {
    super();

    this.limitRecordsPerQuery = APP_CONFIG.PAGINATION_LIMIT.LIKES;
  }
}
