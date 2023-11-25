import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { EmbeddedProfile, EmbeddedProfileSchema } from './embedded';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like extends CommonSchema {
  @Prop({ type: EmbeddedProfileSchema, required: true })
  profile: EmbeddedProfile;

  @Prop({ type: EmbeddedProfileSchema, required: true })
  targetProfile: EmbeddedProfile;

  @Prop({ type: Boolean, required: false, default: false })
  isMatched: boolean;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index(
  { 'profile._id': 1, 'targetProfile._id': 1 },
  { unique: true },
);

LikeSchema.index(
  {
    'targetProfile._id': 1,
    isMatched: 1,
    'profile.gender': 1,
    'profile.birthday': 1,
    createdAt: 1,
  },
  {
    partialFilterExpression: {
      isMatched: { $eq: false },
    },
  },
);
