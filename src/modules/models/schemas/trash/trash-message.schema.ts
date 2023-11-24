import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Message } from '../message.schema';

export type TrashMessageDocument = HydratedDocument<TrashMessage>;

@Schema({ timestamps: true })
export class TrashMessage extends Message {}

export const TrashMessageSchema = SchemaFactory.createForClass(TrashMessage);
