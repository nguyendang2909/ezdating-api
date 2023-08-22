import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './common-model';
import { Like } from './schemas/like.schema';

@Injectable()
export class LikeModel extends CommonModel {
  constructor(
    @InjectModel(Like.name)
    public readonly model: Model<Like>,
  ) {
    super();
  }
}
