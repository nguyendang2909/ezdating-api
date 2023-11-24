import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Like } from '../like.schema';

export type TrashLikeDocument = HydratedDocument<TrashLike>;

@Schema({ timestamps: true })
export class TrashLike extends Like {}

export const TrashLikeSchema = SchemaFactory.createForClass(TrashLike);
