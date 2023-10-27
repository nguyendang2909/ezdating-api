import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { Profile, ProfileSchema } from './profile.schema';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like extends CommonSchema {
  @Prop({ type: ProfileSchema, required: true })
  profile: Profile;

  @Prop({ type: ProfileSchema, required: true })
  targetProfile: Profile;

  @Prop({ type: Boolean, required: false, default: false })
  isMatched: boolean;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index(
  { 'profile._id': 1, 'targetProfile._id': 1 },
  { unique: true },
);

LikeSchema.index(
  { 'targetProfile._id': 1, isMatched: 1, createdAt: -1 },
  {
    partialFilterExpression: {
      isMatched: { $eq: false },
    },
  },
);
