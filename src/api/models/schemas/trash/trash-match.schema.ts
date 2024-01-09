import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Match } from '../match.schema';

export type TrashMatchDocument = HydratedDocument<TrashMatch>;

@Schema({ timestamps: true })
export class TrashMatch extends Match {}

export const TrashMatchSchema = SchemaFactory.createForClass(TrashMatch);
