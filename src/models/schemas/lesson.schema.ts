import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';

import { CommonSchema } from './bases/schemas.common';

export type LessionDocument = HydratedDocument<Lession>;

@Schema({ timestamps: true })
export class Lession extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  _courseId: mongoose.Types.ObjectId;

  @Prop({ type: String, length: 250, required: true })
  title: string;

  @Prop({
    type: String,
  })
  videoURL?: string;

  @Prop({ type: String })
  content?: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lession);
