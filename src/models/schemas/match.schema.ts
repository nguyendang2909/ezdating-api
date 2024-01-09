import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../commons/schemas.common';
import { EmbeddedProfile, EmbeddedProfileSchema } from './embedded';
import { Message, MessageSchema } from './message.schema';

export type MatchDocument = HydratedDocument<Match>;

export type MatchWithTargetProfileDocument =
  HydratedDocument<MatchWithTargetProfile>;

export type MatchWithTargetProfile = Omit<
  Match,
  'profileOne' | 'profileTwo' | 'userOneRead' | 'userTwoRead'
> & {
  read?: boolean;
  targetProfile: EmbeddedProfile;
};

@Schema({ timestamps: true })
export class Match extends CommonSchema {
  @Prop({ type: EmbeddedProfileSchema, required: true })
  profileOne: EmbeddedProfile;

  @Prop({ type: EmbeddedProfileSchema, required: true })
  profileTwo: EmbeddedProfile;

  targetProfile?: EmbeddedProfile;

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

MatchSchema.index(
  { 'profileOne._id': 1, 'profileTwo._id': 1 },
  { unique: true },
);

MatchSchema.index(
  {
    'profileOne._id': 1,
    'profileTwo._id': 1,
    lastMessage: 1,
    createdAt: -1,
  },
  {
    partialFilterExpression: {
      lastMessage: { $exists: false },
    },
  },
);

MatchSchema.index({
  'profileOne._id': 1,
  'profileTwo._id': 1,
  'lastMessage.createdAt': -1,
});
