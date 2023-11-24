import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { User } from '../user.schema';

export type TrashUserDocument = HydratedDocument<TrashUser>;

@Schema({ timestamps: true })
export class TrashUser extends User {}

export const TrashUserSchema = SchemaFactory.createForClass(TrashUser);
