import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from '../bases';
import { TrashProfileFilter, TrashProfileFilterDocument } from '../schemas';

@Injectable()
export class TrashProfileFilterModel extends CommonModel<TrashProfileFilter> {
  constructor(
    @InjectModel(TrashProfileFilter.name)
    readonly model: Model<TrashProfileFilterDocument>,
  ) {
    super();
  }
}
