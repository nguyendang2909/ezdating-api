import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from '../bases';
import { TrashUser, TrashUserDocument } from '../schemas';

@Injectable()
export class TrashUserModel extends CommonModel<TrashUser> {
  constructor(
    @InjectModel(TrashUser.name) readonly model: Model<TrashUserDocument>,
  ) {
    super();
  }
}
