import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../commons/schemas.common';

export type PushNotificationDocument = HydratedDocument<PushNotification>;

@Schema({ timestamps: true })
export class PushNotification extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  _targetUserId?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _signedDeviceId: Types.ObjectId;

  @Prop({ type: String })
  title?: string;

  @Prop({ type: String })
  content?: string;
}

export const PushNotificationSchema =
  SchemaFactory.createForClass(PushNotification);
