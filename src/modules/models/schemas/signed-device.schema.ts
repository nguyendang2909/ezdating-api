import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';
import { DEVICE_PLATFORMS } from '../../../constants';
import { DevicePlatform } from '../../../types';

export type SignedDeviceDocument = HydratedDocument<SignedDevice>;

@Schema({ timestamps: true })
export class SignedDevice extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  refreshToken: string;

  @Prop({ type: Date, required: true })
  expiresIn: Date;

  @Prop({ type: String })
  token?: string;

  @Prop({ type: Number, enum: DEVICE_PLATFORMS })
  platform?: DevicePlatform;
}

export const SignedDeviceSchema = SchemaFactory.createForClass(SignedDevice);

SignedDeviceSchema.index({ _userId: 1, refreshToken: 'hashed' });
