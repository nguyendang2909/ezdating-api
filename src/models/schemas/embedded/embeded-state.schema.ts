import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonEmbeddedSchema } from '../bases/schemas.common';
import {
  EmbeddedCountry,
  EmbeddedCountrySchema,
} from './embedded-country.schema';

export type EmbeddedStateDocument = HydratedDocument<EmbeddedState>;

@Schema()
export class EmbeddedState extends CommonEmbeddedSchema {
  @Prop({ type: String })
  name?: string;

  @Prop({ type: EmbeddedCountrySchema, required: true })
  country: EmbeddedCountry;
}

export const EmbeddedStateSchema = SchemaFactory.createForClass(EmbeddedState);
