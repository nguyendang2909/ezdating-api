import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { Profile, ProfileSchema } from './profile.schema';

export type ViewDocument = HydratedDocument<View>;

@Schema({ timestamps: true })
export class View extends CommonSchema {
  @Prop({ type: ProfileSchema, required: true })
  profile: Profile;

  @Prop({ type: ProfileSchema, required: true })
  targetProfile: Profile;

  @Prop({ type: Boolean, required: false, default: false })
  isLiked?: boolean;

  @Prop({ type: Date, default: new Date(), required: true })
  viewedAt?: Date;
}

export const ViewSchema = SchemaFactory.createForClass(View);

ViewSchema.index({ _userId: 1, _targetUserId: 1 }, { unique: true });
