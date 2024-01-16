import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';

import { CommonSchema } from './bases/schemas.common';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  _courseCategoryId: mongoose.Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  _userId: mongoose.Types.ObjectId;

  @Prop({ type: String, length: 100, required: true })
  title: string;

  @Prop({ type: String, length: '500' })
  subTitle?: string;

  @Prop({ type: String })
  coverImageURL?: string;

  @Prop({ type: String })
  bannerURL?: string;

  @Prop({ type: String })
  introductionVideoURL?: string;

  @Prop({ type: String })
  about?: string;

  @Prop({ type: String })
  output?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
