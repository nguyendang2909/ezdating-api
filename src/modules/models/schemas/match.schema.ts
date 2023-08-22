import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';

export type MathDocument = HydratedDocument<Match>;

@Schema({ timestamps: true })
export class Match extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userOneId?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userTwoId?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  _lastMessageUserId?: Types.ObjectId;

  @Prop({ type: String, length: 200 })
  lastMessage?: string;

  @Prop({ type: Date })
  lastMessageAt?: Date;

  @Prop({ type: Date, required: true })
  matchedAt?: Date;

  @Prop({ type: Boolean, default: false })
  userOneRead?: boolean;

  @Prop({ type: Boolean, default: false })
  userTwoRead?: boolean;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

MatchSchema.index({ _userOneId: 1, _userTwoId: 1 }, { unique: true });

MatchSchema.index({
  _userOneId: 1,
  _userTwoId: 1,
  matchedAt: 1,
});

MatchSchema.index({
  _userOneId: 1,
  _userTwoId: 1,
  lastMessageAt: 1,
});