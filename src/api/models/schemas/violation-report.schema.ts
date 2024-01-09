import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';

export type ViolationReportDocument = HydratedDocument<ViolationReport>;

@Schema({ timestamps: true })
export class ViolationReport extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  _userId: mongoose.Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  _targetUserId: mongoose.Types.ObjectId;

  @Prop({ type: String })
  reason: string;
}

export const ViolationReportSchema =
  SchemaFactory.createForClass(ViolationReport);
