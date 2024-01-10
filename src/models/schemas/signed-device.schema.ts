import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { DEVICE_PLATFORMS } from '../../constants';
import { DevicePlatform } from '../../types';
import { CommonSchema } from './bases/schemas.common';

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

  @Prop({ type: String })
  language?: string;

  @Prop({ type: String })
  languageCode?: string;
}

export const SignedDeviceSchema = SchemaFactory.createForClass(SignedDevice);

SignedDeviceSchema.index({ _userId: 1 });

SignedDeviceSchema.index({ _userId: 1, refreshToken: 'hashed' });
