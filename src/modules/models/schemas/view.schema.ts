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
}

export const ViewSchema = SchemaFactory.createForClass(View);

ViewSchema.index({ _userId: 1, _targetUserId: 1 }, { unique: true });
