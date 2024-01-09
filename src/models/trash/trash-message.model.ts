import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from '../bases';
import { TrashMessage, TrashMessageDocument } from '../schemas';

@Injectable()
export class TrashMessageModel extends CommonModel<TrashMessage> {
  constructor(
    @InjectModel(TrashMessage.name)
    readonly model: Model<TrashMessageDocument>,
  ) {
    super();
  }
}
