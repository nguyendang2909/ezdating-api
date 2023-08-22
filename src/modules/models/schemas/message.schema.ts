import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

import { CommonSchema } from '../../../commons/schemas.common';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message extends CommonSchema {
  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _matchId?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId })
  _replyMessageId?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true })
  _userId: Types.ObjectId;

  @Prop({ type: String })
  audio?: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: String })
  text?: string;

  @Prop({ type: String })
  uuid?: string;

  @Prop({ type: String })
  video?: string;
}
