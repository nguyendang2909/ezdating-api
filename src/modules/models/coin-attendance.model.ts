import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CommonModel } from './common-model';
import { CoinAttendance } from './schemas/coin-attendance.schema';

@Injectable()
export class CoinAttendanceModel extends CommonModel {
  constructor(
    @InjectModel(CoinAttendance.name)
    public readonly model: Model<CoinAttendance>,
  ) {
    super();
  }
}