import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';

import { USER_ROLES, USER_STATUSES } from '../../constants';
import { UserRole, UserStatus } from '../../types';
import { CommonSchema } from './bases/schemas.common';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends CommonSchema {
  @Prop({ type: [SchemaTypes.ObjectId] })
  _blockedIds?: mongoose.Types.ObjectId[];

  @Prop({ type: [SchemaTypes.ObjectId] })
  _blockedByIds?: mongoose.Types.ObjectId[];

  @Prop({ type: String })
  appleId?: string;

  @Prop({ type: String })
  bannedReason?: string;

  @Prop({ type: Number, default: 0 })
  coins: number;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  facebookId?: string;

  @Prop({ type: Boolean, default: false, required: true })
  haveProfile: boolean;

  @Prop({ type: String, length: 300 })
  password?: string;

  @Prop({ type: String, length: 20 })
  phoneNumber?: string;

  @Prop({
    type: Number,
    enum: USER_ROLES,
    required: true,
    default: USER_ROLES.MEMBER,
  })
  role: UserRole;

  @Prop({ type: Number, enum: USER_STATUSES, default: USER_STATUSES.ACTIVATED })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true },
    },
  },
);

UserSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phoneNumber: { $exists: true },
    },
  },
);

UserSchema.index(
  { facebookId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      facebookId: { $exists: true },
    },
  },
);
