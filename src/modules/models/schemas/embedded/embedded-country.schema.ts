import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonEmbeddedSchema } from '../../../../commons/schemas.common';

export type EmbeddedCountryDocument = HydratedDocument<EmbeddedCountry>;

@Schema({ timestamps: true })
export class EmbeddedCountry extends CommonEmbeddedSchema {
  @Prop({ type: String, required: true, index: false, unique: false })
  name: string;

  @Prop({ type: String, required: true, index: false, unique: false })
  iso2: string;
}

export const EmbeddedCountrySchema =
  SchemaFactory.createForClass(EmbeddedCountry);
