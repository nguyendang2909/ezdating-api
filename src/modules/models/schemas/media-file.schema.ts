import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import {
  MediaFileType,
  MediaFileTypes,
} from '../../../commons/constants/constants';
import { CommonSchema } from '../../../commons/schemas.common';
import { User } from './user.schema';

export type MediaFileDocument = HydratedDocument<MediaFile>;

@Schema({ timestamps: true })
export class MediaFile extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  _userId: Types.ObjectId;

  @Prop({ type: String })
  key?: string;

  @Prop({ type: String, required: true })
  location?: string;

  @Prop({ type: Number, enum: MediaFileTypes, required: true })
  type?: MediaFileType;
}