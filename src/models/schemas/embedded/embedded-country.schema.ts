import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonEmbeddedSchema } from '../../../commons/schemas.common';

export type EmbeddedCountryDocument = HydratedDocument<EmbeddedCountry>;

@Schema()
export class EmbeddedCountry extends CommonEmbeddedSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  iso2: string;

  @Prop({ type: String, required: true })
  native: string;
}

export const EmbeddedCountrySchema =
  SchemaFactory.createForClass(EmbeddedCountry);
