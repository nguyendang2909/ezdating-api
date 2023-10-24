import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Types } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import {
  EDUCATION_LEVELS,
  GENDERS,
  RELATIONSHIP_GOALS,
  RELATIONSHIP_STATUSES,
} from '../../../constants';
import {
  EducationLevel,
  Gender,
  RelationshipGoal,
  RelationshipStatus,
} from '../../../types';
import { MediaFileDocument, MediaFileSchema } from './media-file.schema';

export type ProfileDocument = HydratedDocument<Profile>;

export type MongoGeoLocation = {
  coordinates: number[];
  type: 'Point';
};

@Schema({ timestamps: true })
export class Profile extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  age: number;

  @Prop({ type: Date, required: true })
  birthday: Date;

  @Prop({ type: String })
  company?: string;

  @Prop({ type: Number, enum: EDUCATION_LEVELS })
  educationLevel?: EducationLevel;

  //   @ManyToOne(() => State, { nullable: true })
  //   @JoinColumn({ name: 'state_id' })
  //   state?: State;

  //   @RelationId((user: User) => user.state)
  //   stateId?: string;

  //   @ManyToOne(() => Country)
  //   @JoinColumn({ name: 'country_id' })
  //   country?: string;

  //   @RelationId((user: User) => user.country)
  //   countryId?: string;

  @Prop({ type: Number, enum: GENDERS, required: true })
  filterGender: Gender;

  @Prop({ type: Number, required: true })
  filterMaxDistance: number;

  @Prop({ type: Number, required: true })
  filterMaxAge: number;

  @Prop({ type: Number, required: true })
  filterMinAge: number;

  @Prop({ type: Number, enum: GENDERS, required: true })
  gender: Gender;

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

  @Prop({ type: Number })
  height?: number;

  @Prop({ type: String, length: 500 })
  introduce?: string;

  @Prop({ type: String })
  jobTitle?: string;

  @Prop({ type: Boolean, default: false })
  hideAge: boolean;

  @Prop({ type: Boolean, default: false })
  hideDistance: boolean;

  @Prop({ type: Date, default: new Date() })
  lastActivatedAt: Date;

  @Prop({ type: [String] })
  languages?: string[];

  @Prop({ type: [MediaFileSchema] })
  mediaFiles?: MediaFileDocument[];

  @Prop({ type: String, length: 100, required: true })
  nickname: string;

  @Prop({ type: Number, enum: RELATIONSHIP_GOALS })
  relationshipGoal?: RelationshipGoal;

  @Prop({ type: Number, enum: RELATIONSHIP_STATUSES })
  relationshipStatus?: RelationshipStatus;

  @Prop({ type: String })
  school?: string;

  @Prop({ type: Number })
  weight?: number;

  distance?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.index({
  geolocation: '2dsphere',
});
