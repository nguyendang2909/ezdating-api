import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, QueryOptions } from 'mongoose';

import { CommonModel } from './bases/common-model';
import { Match } from './schemas';
import {
  CoinAttendance,
  CoinAttendanceDocument,
} from './schemas/coin-attendance.schema';

@Injectable()
export class CoinAttendanceModel extends CommonModel<CoinAttendance> {
  constructor(
    @InjectModel(CoinAttendance.name)
    public readonly model: Model<CoinAttendanceDocument>,
  ) {
    super();
  }

  deleteManyByUserId(
    _userId: mongoose.Types.ObjectId,
    options?: QueryOptions<Match>,
  ) {
    return this.model.deleteMany({ _userId }, options);
  }
}
