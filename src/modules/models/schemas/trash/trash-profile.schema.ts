import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Profile } from '../profile.schema';

export type TrashProfileDocument = HydratedDocument<TrashProfile>;

@Schema({ timestamps: true })
export class TrashProfile extends Profile {}

export const TrashProfileSchema = SchemaFactory.createForClass(TrashProfile);
