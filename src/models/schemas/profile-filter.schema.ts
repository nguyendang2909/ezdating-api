import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { GENDERS, RELATIONSHIP_GOALS } from '../../constants';
import { Gender, RelationshipGoal } from '../../types';
import { CommonSchema } from './bases/schemas.common';

export type ProfileFilterDocument = HydratedDocument<ProfileFilter>;

@Schema({ timestamps: true })
export class ProfileFilter extends CommonSchema {
  @Prop({ type: Number, enum: GENDERS, required: true })
  gender: Gender;

  @Prop({ type: Number, required: true })
  maxDistance: number;

  @Prop({ type: Number, required: true })
  maxAge: number;

  @Prop({ type: Number, required: true })
  minAge: number;

  @Prop({ type: Number, enum: RELATIONSHIP_GOALS })
  relationshipGoal?: RelationshipGoal;
}

export const ProfileFilterSchema = SchemaFactory.createForClass(ProfileFilter);
