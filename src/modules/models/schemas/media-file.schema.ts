import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { MEDIA_FILE_TYPES } from '../../../constants';
import { MediaFileType } from '../../../types';

export type MediaFileDocument = HydratedDocument<MediaFile>;

@Schema({ timestamps: true })
export class MediaFile extends CommonSchema {
  // @Prop({
  //   type: SchemaTypes.ObjectId,
  //   ref: User.name,
  //   required: true,
  //   index: true,
  // })
  // _userId: Types.ObjectId;

  @Prop({ type: String })
  key?: string;

  @Prop({ type: String, required: true })
  location?: string;

  @Prop({ type: Number, enum: MEDIA_FILE_TYPES, required: true })
  type?: MediaFileType;
}

export const MediaFileSchema = SchemaFactory.createForClass(MediaFile);
