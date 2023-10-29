import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../../commons/schemas.common';
import { GENDERS } from '../../../../constants';
import { Gender } from '../../../../types';
import {
  EmbeddedMediaFile,
  EmbeddedMediaFileSchema,
} from '../media-file.schema';

export type EmbeddedProfileDocument = HydratedDocument<EmbeddedProfile>;

@Schema({ timestamps: true })
export class EmbeddedProfile extends CommonSchema {
  @Prop({ type: Date, required: true })
  birthday: Date;

  @Prop({ type: Number, enum: GENDERS, required: true })
  gender: Gender;

  @Prop({ type: Boolean })
  hideAge: boolean;

  @Prop({ type: Boolean })
  hideDistance: boolean;

  @Prop({ type: [EmbeddedMediaFileSchema] })
  mediaFiles?: EmbeddedMediaFile[];

  @Prop({ type: String, length: 100, required: true })
  nickname: string;
}

export const EmbeddedProfileSchema =
  SchemaFactory.createForClass(EmbeddedProfile);