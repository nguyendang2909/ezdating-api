import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from '../bases';
import { TrashLike, TrashLikeDocument } from '../schemas';

@Injectable()
export class TrashLikeModel extends CommonModel<TrashLike> {
  constructor(
    @InjectModel(TrashLike.name)
    readonly model: Model<TrashLikeDocument>,
  ) {
    super();
  }
}
