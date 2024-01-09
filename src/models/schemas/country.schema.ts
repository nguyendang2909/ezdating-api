import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { CommonSchema } from './bases/schemas.common';

export type CountryDocument = HydratedDocument<Country>;

@Schema({ timestamps: true })
export class Country extends CommonSchema {
  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: String })
  iso3: string;

  @Prop({ type: String })
  numericCode: string;

  @Prop({ type: String, unique: true, required: true })
  iso2: string;

  @Prop({ type: String })
  phoneCode: string;

  @Prop({ type: String })
  capital: string;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: String })
  currencyName: string;

  @Prop({ type: String })
  currencySymbol: string;
  @Prop({ type: String })
  tld: string;

  @Prop({ type: String, required: true })
  native: string;

  @Prop({ type: String })
  region: string;

  @Prop({ type: String })
  subregion: string;

  @Prop({ type: String })
  translations: string;

  @Prop({ type: String })
  latitude: string;

  @Prop({ type: String })
  longitude: string;

  @Prop({ type: String })
  emoji: string;

  @Prop({ type: String })
  emojiU: string;

  @Prop({ type: Number, required: true })
  sourceId: number;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
