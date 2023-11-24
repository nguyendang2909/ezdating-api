import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { View } from '../view.schema';

export type TrashViewDocument = HydratedDocument<TrashView>;

@Schema({ timestamps: true })
export class TrashView extends View {}

export const TrashViewSchema = SchemaFactory.createForClass(TrashView);
