import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { GENDERS } from '../../../constants';
import { Gender } from '../../../types';
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

  @Prop({ type: EmbeddedStateSchema, required: true })
  state: EmbeddedState;

  @Prop({ type: Number })
  weight?: number;

  distance?: string;

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
}

export const BasicProfileSchema = SchemaFactory.createForClass(BasicProfile);
