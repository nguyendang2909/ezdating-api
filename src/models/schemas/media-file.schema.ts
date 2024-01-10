import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Types } from 'mongoose';

import { MEDIA_FILE_TYPES } from '../../constants';
import { MediaFileType } from '../../types';
import { CommonSchema } from './bases/schemas.common';

export type MediaFileDocument = HydratedDocument<MediaFile>;

@Schema({ timestamps: true })
export class MediaFile extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: Number, enum: MEDIA_FILE_TYPES, required: true })
  type: MediaFileType;

  @Prop({ type: String, required: false })
  location: string;
}

export const MediaFileSchema = SchemaFactory.createForClass(MediaFile);
