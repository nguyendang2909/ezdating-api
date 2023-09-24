import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import {
  DevicePlatform,
  DevicePlatforms,
} from '../../../commons/constants';
import { CommonSchema } from '../../../commons/schemas.common';

export type SignedDeviceDocument = HydratedDocument<SignedDevice>;

@Schema({ timestamps: true })
export class SignedDevice extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId?: Types.ObjectId;

  @Prop({ type: String, required: true })
  refreshToken?: string;

  @Prop({ type: Date, required: true })
  expiresIn?: Date;

  @Prop({ type: String })
  deviceId: string;

  @Prop({ type: String, enum: DevicePlatforms })
  platform: DevicePlatform;
}

export const SignedDeviceSchema = SchemaFactory.createForClass(SignedDevice);

SignedDeviceSchema.index({ _userId: 1, refreshToken: 1 });
