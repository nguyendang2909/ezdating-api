import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { EmbeddedProfile, EmbeddedProfileSchema } from './embedded';

export type ViewDocument = HydratedDocument<View>;

@Schema({ timestamps: true })
export class View extends CommonSchema {
  @Prop({ type: EmbeddedProfileSchema, required: true })
  profile: EmbeddedProfile;

  @Prop({ type: EmbeddedProfileSchema, required: true })
  targetProfile: EmbeddedProfile;

  @Prop({ type: Boolean, required: false, default: false })
  isLiked?: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  isMatched?: boolean;
}

export const ViewSchema = SchemaFactory.createForClass(View);

ViewSchema.index({ _userId: 1, _targetUserId: 1 }, { unique: true });

ViewSchema.index(
  { 'profile._id': 1, isLiked: 1, isMatched: 1, createdAt: 1 },
  {
    partialFilterExpression: {
      isLiked: { $eq: false },
      isMatched: { $eq: false },
    },
  },
);
