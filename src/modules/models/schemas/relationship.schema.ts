import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import {
  RelationshipUserStatus,
  RelationshipUserStatuses,
} from '../../../commons/constants/constants';
import { CommonSchema } from '../../../commons/schemas.common';

export type RelationshipDocument = HydratedDocument<Relationship>;

@Schema({ timestamps: true })
export class Relationship extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userOneId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userTwoId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  _lastMessageUserId?: Types.ObjectId;

  @Prop({ type: Boolean })
  canUserOneChat?: boolean;

  @Prop({ type: Boolean })
  canUserTwoChat?: boolean;

  @Prop({ type: String, length: 200 })
  lastMessage?: string;

  @Prop({ type: Date })
  lastMessageAt?: Date;

  @Prop({ type: Boolean, default: false })
  userOneRead?: boolean;

  @Prop({ type: Boolean, default: false })
  userTwoRead?: boolean;

  @Prop({
    type: Number,
    enum: RelationshipUserStatuses,
  })
  userOneStatus?: RelationshipUserStatus;

  @Prop({
    type: Number,
    enum: RelationshipUserStatuses,
  })
  userTwoStatus?: RelationshipUserStatus;

  @Prop({ type: Date, default: new Date() })
  statusAt?: Date;

  @Prop({ type: Date })
  userOneStatusAt: Date;

  @Prop({ type: Date })
  userTwoStatusAt: Date;
}

export const RelationshipSchema = SchemaFactory.createForClass(Relationship);

RelationshipSchema.index({ _userOneId: 1, _userTwoId: 1 }, { unique: true });