import { Injectable, Logger } from '@nestjs/common';
import async from 'async';
import Axios from 'axios';
import fs from 'fs';

import { Country, CountryModel, StateModel } from '../models';
import {
  StateOfStatesResponse,
  StateResponse,
  StatesResponse,
} from '../states/states.type';
import {
  CountriesResponse,
  CountryOfCountriesResponse,
  CountryResponse,
} from './countries.type';

@Injectable()
export class CountriesService {
  constructor(
    private readonly stateModel: StateModel,
    private readonly countryModel: CountryModel,
  ) {}

  private readonly logger = new Logger(CountriesService.name);

  async onApplicationBootstrap() {
    // this.runRemove();
    // this.runMigration();
    // this.setupCountries();
    // this.setupStates();
  }

  async setupCountries() {
    const countries = await this.countryModel.findMany(
      {},
      {
        name: 1,
        iso2: 1,
        native: 1,
      },
    );

    fs.writeFileSync(
      'src/data/countries.json',
      JSON.stringify(countries, null, 2),
    );
  }

  async setupStates() {
    const countries = await this.countryModel.findMany(
      {},
      {
        name: 1,
        iso2: 1,
        native: 1,
      },
    );
    const result: Record<string, any> = {};
    for (const country of countries) {
      const states = await this.stateModel.findMany(
        { 'country._id': country._id },
        {
          name: 1,
        },
      );
      result[country.iso2] = states;
    }

    fs.writeFileSync('src/data/states.json', JSON.stringify(result, null, 2));
  }

  async runRemove() {
    console.log(111);
    await Promise.all([
      this.stateModel.deleteMany({ _id: { $exists: true } }),
      this.countryModel.deleteMany({ _id: { $exists: true } }),
    ]);
    console.log(2222);
  }

  async runMigration() {
    this.logger.log('Start run country migaration');
    const { data: countries } =
      await this.locationsService.get<CountriesResponse>('/v1/countries');
    for (const countryData of countries) {
      console.log(1111);
      try {
        const country = await this.migrateCountry(countryData);
        const { data: states } =
          await this.locationsService.get<StatesResponse>(
            `/v1/countries/${country.iso2}/states`,
          );
        await async.eachLimit(states, 3, async (state) => {
          await this.migrateState(state, country);
        });
        console.log(222);
      } catch (error) {
        this.logger.error('');
      }
    }
    this.logger.log('Finish run country migration');
  }

  async migrateCountry(country: CountryOfCountriesResponse) {
    const { data: countryData } =
      await this.locationsService.get<CountryResponse>(
        `/v1/countries/${country.iso2}`,
      );
    return await this.countryModel.createOne({
      capital: countryData.capital,
      currency: countryData.currency,
      currencyName: countryData.currency_name,
      currencySymbol: countryData.currency_symbol,
      emoji: countryData.emoji,
      emojiU: countryData.emojiU,
      iso2: countryData.iso2,
      iso3: countryData.iso3,
      latitude: countryData.latitude,
      longitude: countryData.longitude,
      name: countryData.name,
      native: countryData.native,
      numericCode: countryData.numeric_code,
      phoneCode: countryData.phonecode,
      region: countryData.region,
      sourceId: countryData.id,
      subregion: countryData.subregion,
      tld: countryData.tld,
      translations: countryData.translations,
    });
  }

  private async migrateState(state: StateOfStatesResponse, country: Country) {
    try {
      const { data: stateData } =
        await this.locationsService.get<StateResponse>(
          `/v1/countries/${country.iso2}/states/${state.iso2}`,
        );
      await this.stateModel.createOne({
        sourceId: stateData.id,
        name: stateData.name,
        country: country,
        countryCode: stateData.country_code,
        iso2: stateData.iso2,
        type: stateData.type,
        latitude: stateData.latitude,
        longitude: stateData.longitude,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  private readonly locationsService = Axios.create({
    baseURL: 'https://api.countrystatecity.in/',
    headers: {
      'X-CSCAPI-KEY': process.env.COUNTRY_STATE_CITY_API_KEY,
    },
  });

  public async findAll() {
    return await this.countryModel.findMany({});
  }

  public async findOneOrFail(iso2: string) {
    return await this.countryModel.findOneOrFail({
      where: {
        iso2,
      },
    });
  }

  //   public async findCountryAndStates(iso2: string) {
  //     return await this.stateModel.findAll({
  //       where: {
  //         countryCode: iso2,
  //       },
  //     });
  //   }
}
