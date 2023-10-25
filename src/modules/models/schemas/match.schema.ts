import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { Message, MessageSchema } from './message.schema';
import { Profile, ProfileSchema } from './profile.schema';

export type MatchDocument = HydratedDocument<Match>;

@Schema({ timestamps: true })
export class Match extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userOneId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userTwoId: Types.ObjectId;

  @Prop({ type: ProfileSchema, required: true })
  profileOne: Profile;

  @Prop({ type: ProfileSchema, required: true })
  profileTwo: Profile;

  // @Prop({ type: SchemaTypes.ObjectId })
  // _lastMessageId?: Types.ObjectId;

  // @Prop({ type: SchemaTypes.ObjectId })
  // _lastMessageUserId?: Types.ObjectId;

  @Prop({ type: MessageSchema })
  lastMessage?: Message;

  // @Prop({ type: String })
  // lastMessage?: string;

  // @Prop({ type: Date })
  // lastMessageAt?: Date;

  @Prop({ type: Boolean, default: false })
  userOneRead: boolean;

  @Prop({ type: Boolean, default: false })
  userTwoRead: boolean;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

MatchSchema.index({ _userOneId: 1, _userTwoId: 1 }, { unique: true });

MatchSchema.index({
  _userOneId: 1,
  _userTwoId: 1,
  'lastMessage._id': 1,
});
