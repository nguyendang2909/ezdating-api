import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';

@Schema({ timestamps: true })
export class CoinAttendance extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId?: Types.ObjectId;

  @Prop({ type: Date, required: true })
  receivedDate?: Date;

  @Prop({ type: Number, required: true })
  receivedDateIndex?: number;

  @Prop({ type: Number, required: true })
  value?: number;
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
