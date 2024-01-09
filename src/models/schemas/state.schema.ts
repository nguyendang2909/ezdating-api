import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from './bases/schemas.common';
import {
  EmbeddedCountry,
  EmbeddedCountrySchema,
} from './embedded/embedded-country.schema';

export type StateDocument = HydratedDocument<State>;

@Schema({ timestamps: true })
export class State extends CommonSchema {
  @Prop({ type: String })
  name?: string;

  @Prop({ type: EmbeddedCountrySchema, required: true })
  country: EmbeddedCountry;

  @Prop({ type: String })
  countryCode?: string;

  @Prop({ type: String })
  iso2?: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  latitude: string;

  @Prop({ type: String })
  longitude: string;

  @Prop({ type: Number })
  sourceId: number;
}

export const StateSchema = SchemaFactory.createForClass(State);

StateSchema.index({
  'country.iso2': 1,
  name: 1,
});
