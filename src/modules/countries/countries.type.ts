export type CountriesResponse = CountryOfCountriesResponse[];

export type CountryOfCountriesResponse = {
  id?: number;
  name?: 'Guernsey and Alderney';
  iso2?: 'GG';
};

export type CountryResponse = {
  id?: number;
  name?: string;
  iso3?: string;
  numeric_code?: string;
  iso2?: string;
  phonecode?: string;
  capital?: string;
  currency?: string;
  currency_name?: string;
  currency_symbol?: string;
  tld?: string;
  native?: string;
  region?: string;
  subregion?: string;
  timezones?: string;
  translations?: string;
  latitude?: string;
  longitude?: string;
  emoji?: string;
  emojiU?: string;
};
