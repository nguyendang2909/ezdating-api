import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonEmbeddedSchema } from '../../../../commons/schemas.common';
import { MEDIA_FILE_TYPES } from '../../../../constants';
import { MediaFileType } from '../../../../types';

export type EmbeddedMediaFileDocument = HydratedDocument<EmbeddedMediaFile>;

@Schema()
export class EmbeddedMediaFile extends CommonEmbeddedSchema {
  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: Number, enum: MEDIA_FILE_TYPES, required: true })
  type: MediaFileType;
}

export const EmbeddedMediaFileSchema =
  SchemaFactory.createForClass(EmbeddedMediaFile);
