import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { USER_ROLES, USER_STATUSES } from '../../../constants';
import { UserRole, UserStatus } from '../../../types';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends CommonSchema {
  @Prop({ type: Number, default: 0 })
  coins: number;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  facebookId?: string;

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
