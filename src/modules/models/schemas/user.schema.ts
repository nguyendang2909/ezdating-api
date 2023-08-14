import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  UserEducationLevel,
  UserEducationLevels,
  UserGender,
  UserGenders,
  UserLookingFor,
  UserLookingFors,
  UserRelationshipStatus,
  UserRelationshipStatuses,
  UserRole,
  UserRoles,
  UserStatus,
  UserStatuses,
} from '../../../commons/constants/constants';
import { CommonSchema } from '../../../commons/schemas.common';
import { MediaFile } from './media-file.schema';

export type UserDocument = HydratedDocument<User>;

export type MongoGeoLocation = {
  coordinates: number[];
  type: 'Point';
};

@Schema({ timestamps: true })
export class User extends CommonSchema {
  @Prop({ type: Date })
  birthday?: Date;

  @Prop({ type: Number, default: 0 })
  coins?: number;

  @Prop({ type: Number, enum: UserEducationLevels })
  educationLevel?: UserEducationLevel;

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

  @Prop({ type: String })
  email?: string;

  @Prop({ type: Number, enum: UserGenders })
  gender?: UserGender;

  @Prop({ type: Number })
  height?: number;

  @Prop({ type: String, length: 500 })
  introduce?: string;

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

  @Prop({ type: Number, enum: UserLookingFors })
  lookingFor?: UserLookingFor;

  @Prop({ type: Number, enum: UserGenders })
  filterGender?: UserGender;

  @Prop({ type: Number })
  filterMaxDistance?: number;

  @Prop({ type: Number })
  filterMinAge?: number;

  @Prop({ type: Number })
  filterMaxAge?: number;

  @Prop({ type: Date, default: new Date() })
  lastActivatedAt?: Date;

  mediaFiles?: MediaFile[];

  @Prop({ type: String, length: 100 })
  nickname?: string;

  @Prop({ type: String, length: 300 })
  password?: string;

  @Prop({ type: String, length: 20 })
  phoneNumber?: string;

  @Prop({ type: Number, enum: UserRelationshipStatuses })
  relationshipStatus?: UserRelationshipStatus;

  @Prop({
    type: Number,
    enum: UserRoles,
    required: true,
    default: UserRoles.member,
  })
  role?: UserRole;

  @Prop({ type: Number, enum: UserStatuses, default: UserStatuses.registered })
  status?: UserStatus;

  @Prop({ type: Number })
  weight?: number;

  distance?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  geolocation: '2dsphere',
});
