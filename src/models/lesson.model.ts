import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './bases/common-model';
import { Lession, LessionDocument } from './schemas';
import { User } from './schemas/user.schema';

@Injectable()
export class LessionModel extends CommonModel<Lession> {
  constructor(@InjectModel(User.name) readonly model: Model<LessionDocument>) {
    super();
  }

  private readonly logger = new Logger(LessionModel.name);
}
