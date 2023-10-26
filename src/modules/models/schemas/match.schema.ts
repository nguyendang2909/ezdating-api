import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { Message, MessageSchema } from './message.schema';
import { Profile, ProfileSchema } from './profile.schema';

export type MatchDocument = HydratedDocument<Match>;

export type MatchWithTargetUserDocument = HydratedDocument<MatchWithTargetUser>;

export type MatchWithTargetUser = Omit<
  Match,
  'profileOne' | 'profileTwo' | 'userOneRead' | 'userTwoRead'
> & {
  read?: boolean;
  targetProfile: Profile;
};

@Schema({ timestamps: true })
export class Match extends CommonSchema {
  @Prop({ type: ProfileSchema, required: true })
  profileOne: Profile;

  @Prop({ type: ProfileSchema, required: true })
  profileTwo: Profile;

  targetProfile?: Profile;

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
  'profileOne._id': 1,
  'profileTwo._id': 1,
  'lastMessage._id': 1,
});
