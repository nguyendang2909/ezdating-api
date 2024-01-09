import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from '../bases';
import { TrashMatch, TrashMatchDocument } from '../schemas';

@Injectable()
export class TrashMatchModel extends CommonModel<TrashMatch> {
  constructor(
    @InjectModel(TrashMatch.name)
    readonly model: Model<TrashMatchDocument>,
  ) {
    super();
  }
}
