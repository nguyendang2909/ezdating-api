import { Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class CommonSchema {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

@Schema()
export class CommonEmbeddedSchema {
  _id: Types.ObjectId;
}
