import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { GENDERS, RELATIONSHIP_GOALS } from '../../constants';
import { Gender, RelationshipGoal } from '../../types';
import { CommonSchema } from './bases/schemas.common';
import {
  EmbeddedState,
  EmbeddedStateSchema,
} from './embedded/embeded-state.schema';
import { MongoGeoLocation } from './profile.schema';

export type BasicProfileDocument = HydratedDocument<BasicProfile>;

@Schema({ timestamps: true })
export class BasicProfile extends CommonSchema {
  @Prop({ type: Date, required: true })
  birthday: Date;

  @Prop({ type: Number, enum: GENDERS, required: true })
  gender: Gender;

  @Prop({ type: String, length: 500 })
  introduce?: string;

  @Prop({ type: String, length: 100, required: true })
  nickname: string;

  @Prop({ type: Number, enum: RELATIONSHIP_GOALS, required: true })
  relationshipGoal: RelationshipGoal;

  @Prop({ type: EmbeddedStateSchema, required: true })
  state: EmbeddedState;

  @Prop({
    type: {
      enum: ['Point'],
      required: false,
      type: String,
    },
    coordinates: {
      required: false,
      type: [Number],
    },
  })
  geolocation?: MongoGeoLocation;

  @Prop({ type: String })
  learningTarget?: string;

  @Prop({ type: String })
  teachingSubject?: string;
}

export const BasicProfileSchema = SchemaFactory.createForClass(BasicProfile);
