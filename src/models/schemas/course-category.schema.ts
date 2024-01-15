import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from './bases/schemas.common';

export type CourseCategoryDocument = HydratedDocument<CourseCategory>;

@Schema({ timestamps: true })
export class CourseCategory extends CommonSchema {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  tag: string;
}

export const CourseCategorySchema =
  SchemaFactory.createForClass(CourseCategory);
