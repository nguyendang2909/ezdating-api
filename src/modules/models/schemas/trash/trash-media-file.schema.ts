import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { MediaFile } from '../media-file.schema';

export type TrashMediaFileDocument = HydratedDocument<TrashMediaFile>;

@Schema({ timestamps: true })
export class TrashMediaFile extends MediaFile {}

export const TrashMediaFileSchema =
  SchemaFactory.createForClass(TrashMediaFile);
