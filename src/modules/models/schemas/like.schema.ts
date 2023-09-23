import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { User } from './user.schema';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  _userId?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  _targetUserId?: Types.ObjectId;

  @Prop({ type: Boolean, required: false, default: false })
  isMatched?: boolean;

  @Prop({ type: Date, default: new Date(), required: true })
  likedAt?: Date;

  user?: User;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index({ _userId: 1, _targetUserId: 1 }, { unique: true });

LikeSchema.index({ _targetUserId: 1, isMatched: 1, likedAt: 1 });
