import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import {
  EDUCATION_LEVELS,
  GENDERS,
  MEMBERSHIPS,
  RELATIONSHIP_GOALS,
  RELATIONSHIP_STATUSES,
} from '../../../constants';
import {
  EducationLevel,
  Gender,
  Membership,
  RelationshipGoal,
  RelationshipStatus,
} from '../../../types';
import {
  EmbeddedMediaFile,
  EmbeddedMediaFileSchema,
} from './embedded/embedded-media-file.schema';
import {
  EmbeddedState,
  EmbeddedStateSchema,
} from './embedded/embeded-state.schema';

export type ProfileDocument = HydratedDocument<Profile>;

export type MongoGeoLocation = {
  coordinates: [number, number];
  type: 'Point';
};

@Schema({ timestamps: true })
export class Profile extends CommonSchema {
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

  @Prop({ type: [String] })
  languages?: string[];

  @Prop({ type: Date, default: new Date() })
  lastActivatedAt: Date;

  @Prop({ type: Number, default: 0 })
  mediaFileCount: number;

  @Prop({ type: [EmbeddedMediaFileSchema] })
  mediaFiles: EmbeddedMediaFile[];

  @Prop({ type: String, enum: MEMBERSHIPS, default: 1 })
  membership: Membership;

  @Prop({ type: String, length: 100, required: true })
  nickname: string;

  @Prop({ type: Boolean, default: false })
  photoVerified: boolean;

  @Prop({ type: Number, enum: RELATIONSHIP_GOALS })
  relationshipGoal: RelationshipGoal;

  @Prop({ type: Number, enum: RELATIONSHIP_STATUSES })
  relationshipStatus?: RelationshipStatus;

  @Prop({ type: String })
  school?: string;

  @Prop({ type: EmbeddedStateSchema, required: true })
  state: EmbeddedState;

  @Prop({ type: Number })
  weight?: number;

  distance?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.index(
  {
    geolocation: '2dsphere',
    mediaFileCount: 1,
    gender: 1,
    birthday: 1,
    lastActivated: 1,
  },
  {
    partialFilterExpression: {
      mediaFileCount: { $gt: 0 },
    },
  },
);
