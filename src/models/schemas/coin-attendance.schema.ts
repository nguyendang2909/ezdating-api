import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../commons/schemas.common';
import { WEEKLY_COINS } from '../../constants';
import { WeeklyCoin } from '../../types';

export type CoinAttendanceDocument = HydratedDocument<CoinAttendance>;
@Schema({ timestamps: true })
export class CoinAttendance extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  receivedDate: Date;

  @Prop({ type: Number, required: true, min: 0, max: 6 })
  receivedDateIndex: number;

  @Prop({ type: Number, required: true, enum: WEEKLY_COINS })
  value: WeeklyCoin;
}

export const CoinAttendanceSchema =
  SchemaFactory.createForClass(CoinAttendance);

CoinAttendanceSchema.index(
  {
    _userId: -1,
    receiveDate: -1,
  },
  { unique: true },
);
