import { Prop, Schema } from '@nestjs/mongoose';
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

export type UserDocument = HydratedDocument<User>;

export type MongoGeoLocation = {
  coordinates: number[];
  type: 'Point';
};

@Schema({ timestamps: true })
export class User extends CommonSchema {
  avatar?: string;

  //   @OneToOne(() => UploadFile, (file) => file.user, {
  //     nullable: true,
  //     onDelete: 'SET NULL',
  //   })
  //   @JoinColumn({ name: 'avatar_file_id' })
  //   avatarFile?: Partial<UploadFile>;

  //   @RelationId((user: User) => user.avatarFile)
  //   avatarFileId?: string;

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

  @Prop({ type: String, length: 100 })
  nickname?: string;

  @Prop({ type: String, length: 300 })
  password?: string;

  @Prop({ type: String, length: 20 })
  phoneNumber?: string;

  //   @OneToMany(() => UploadFile, (file) => file.user)
  //   uploadFiles: Partial<UploadFile>[];

  @Prop({
    type: Number,
    enum: UserRoles,
    required: true,
    default: UserRoles.member,
  })
  role?: UserRole;

  @Prop({ type: Number, enum: UserStatuses, default: UserStatuses.registered })
  status?: UserStatus;

  @Prop({ type: Date, default: new Date() })
  lastActivatedAt?: Date;

  @Prop({ type: Number, enum: UserRelationshipStatuses })
  relationshipStatus?: UserRelationshipStatus;

  @Prop({ type: Number })
  weight?: number;

  distance?: string;
}
