import { Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class CommonSchema {
  createdAt?: Date;

  updatedAt?: Date;
}
