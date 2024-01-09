import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ProfileFilter } from '../profile-filter.schema';

export type TrashProfileFilterDocument = HydratedDocument<TrashProfileFilter>;

@Schema({ timestamps: true })
export class TrashProfileFilter extends ProfileFilter {}

export const TrashProfileFilterSchema =
  SchemaFactory.createForClass(TrashProfileFilter);
