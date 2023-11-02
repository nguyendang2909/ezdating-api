import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../../commons/schemas.common';
import { MEDIA_FILE_TYPES } from '../../../../constants';
import { MediaFileType } from '../../../../types';

export type EmbeddedMediaFileDocument = HydratedDocument<EmbeddedMediaFile>;

@Schema({ timestamps: true })
export class EmbeddedMediaFile extends CommonSchema {
  @Prop({ type: String })
  key?: string;

  @Prop({ type: Number, enum: MEDIA_FILE_TYPES, required: true })
  type?: MediaFileType;
}

export const EmbeddedMediaFileSchema =
  SchemaFactory.createForClass(EmbeddedMediaFile);
