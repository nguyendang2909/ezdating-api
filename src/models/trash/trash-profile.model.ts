import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from '../bases';
import { TrashProfile, TrashProfileDocument } from '../schemas';

@Injectable()
export class TrashProfileModel extends CommonModel<TrashProfile> {
  constructor(
    @InjectModel(TrashProfile.name) readonly model: Model<TrashProfileDocument>,
  ) {
    super();
  }
}
