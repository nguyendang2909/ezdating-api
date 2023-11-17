import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonEmbeddedSchema } from '../../../../commons/schemas.common';
import { GENDERS } from '../../../../constants';
import { Gender } from '../../../../types';
import {
  EmbeddedMediaFile,
  EmbeddedMediaFileSchema,
} from './embedded-media-file.schema';

export type EmbeddedProfileDocument = HydratedDocument<EmbeddedProfile>;

@Schema()
export class EmbeddedProfile extends CommonEmbeddedSchema {
  @Prop({ type: Date, required: true })
  birthday: Date;

  @Prop({ type: Number, enum: GENDERS, required: true })
  gender: Gender;

  @Prop({ type: Boolean })
  hideAge: boolean;

  @Prop({ type: Boolean })
  hideDistance: boolean;

  @Prop({ type: String, length: 500 })
  introduce?: string;

  @Prop({ type: Date, default: new Date() })
  lastActivatedAt: Date;

  @Prop({ type: Number, default: 0 })
  mediaFileCount: number;

  @Prop({ type: [EmbeddedMediaFileSchema] })
  mediaFiles: EmbeddedMediaFile[];

  @Prop({ type: String, length: 100, required: true })
  nickname: string;

  @Prop({ type: Boolean, default: false })
  photoVerified: boolean;
}

export const EmbeddedProfileSchema =
  SchemaFactory.createForClass(EmbeddedProfile);
