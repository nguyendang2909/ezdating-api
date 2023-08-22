import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _targetUserId?: Types.ObjectId;

  @Prop({ type: Date, default: new Date(), required: true })
  likedAt?: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index({ _userId: 1, _targetUserId: 1 }, { unique: true });