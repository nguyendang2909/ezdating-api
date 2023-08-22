import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';

export type ViewDocument = HydratedDocument<View>;

@Schema({ timestamps: true })
export class View extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _targetUserId?: Types.ObjectId;

  @Prop({ type: Date, default: new Date(), required: true })
  viewedAt?: Date;
}

export const ViewSchema = SchemaFactory.createForClass(View);

ViewSchema.index({ _userId: 1, _targetUserId: 1 }, { unique: true });
