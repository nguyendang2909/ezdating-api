import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from '../bases';
import { TrashView, TrashViewDocument } from '../schemas';

@Injectable()
export class TrashViewModel extends CommonModel<TrashView> {
  constructor(
    @InjectModel(TrashView.name)
    readonly model: Model<TrashViewDocument>,
  ) {
    super();
  }
}
