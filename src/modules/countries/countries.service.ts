// import { Injectable, Logger } from '@nestjs/common';
// import Axios from 'axios';

// import { CountryModel } from '../entities/country.model';
// import { Country } from '../entities/entities/country.entity';
// import { StateModel } from '../entities/state.model';
// import { StateOfStatesResponse, StateResponse } from '../states/states.type';
// import { CountryOfCountriesResponse } from './countries.type';

// @Injectable()
// export class CountriesService {
//   constructor(
//     private readonly stateModel: StateModel,
//     private readonly countryModel: CountryModel,
//   ) {}

//   private readonly logger = new Logger(CountriesService.name);

//   // async onApplicationBootstrap() {
//   //   try {
//   //     const { data: countries } =
//   //       await this.locationsService.get<CountriesResponse>('/v1/countries');
//   //     await async.eachLimit(countries, 3, async (country) => {
//   //       await this.migrateCountry(country);
//   //       const { data: states } =
//   //         await this.locationsService.get<StatesResponse>(
//   //           `/v1/countries/${country.iso2}/states`,
//   //         );
//   //       await async.eachLimit(states, 3, async (state) => {
//   //         await this.migrateState(state, country);
//   //       });
//   //     });
//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // }

//   // private async migrateCountry(country: CountryOfCountriesResponse) {
//   //   try {
//   //     const { data: countryData } =
//   //       await this.locationsService.get<CountryResponse>(
//   //         `/v1/countries/${country.iso2}`,
//   //       );
//   //     await this.countryEntity.saveOne({
//   //       id: countryData.id,
//   //       name: countryData.name,
//   //       iso3: countryData.iso3,
//   //       numericCode: countryData.numeric_code,
//   //       iso2: countryData.iso2,
//   //       phoneCode: countryData.phonecode,
//   //       capital: countryData.capital,
//   //       currency: countryData.currency,
//   //       currency_name: countryData.currency_name,
//   //       currencySymbol: countryData.currency_symbol,
//   //       tld: countryData.tld,
//   //       native: countryData.native,
//   //       region: countryData.region,
//   //       subregion: countryData.subregion,
//   //       translations: countryData.translations,
//   //       latitude: countryData.latitude,
//   //       longitude: countryData.longitude,
//   //       emoji: countryData.emoji,
//   //       emojiU: countryData.emojiU,
//   //     });
//   //   } catch (err) {
//   //     this.logger.error(err);
//   //   }
//   // }

//   private async migrateState(
//     state: StateOfStatesResponse,
//     country: CountryOfCountriesResponse,
//   ) {
//     try {
//       const { data: stateData } =
//         await this.locationsService.get<StateResponse>(
//           `/v1/countries/${country.iso2}/states/${state.iso2}`,
//         );
//       await this.stateModel.saveOne({
//         id: stateData.id,
//         name: stateData.name,
//         country: new Country({ id: country.id }),
//         countryCode: stateData.country_code,
//         iso2: stateData.iso2,
//         type: stateData.type,
//         latitude: stateData.latitude,
//         longitude: stateData.longitude,
//       });
//     } catch (err) {
//       this.logger.error(err);
//     }
//   }

//   private readonly locationsService = Axios.create({
//     baseURL: 'https://api.countrystatecity.in/',
//     headers: {
//       'X-CSCAPI-KEY': process.env.COUNTRY_STATE_CITY_API_KEY,
//     },
//   });

//   public async findAll() {
//     return await this.countryModel.findAll({});
//   }

//   public async findOneOrFail(iso2: string) {
//     return await this.countryModel.findOneOrFail({
//       where: {
//         iso2,
//       },
//     });
//   }

//   public async findCountryAndStates(iso2: string) {
//     return await this.stateModel.findAll({
//       where: {
//         countryCode: iso2,
//       },
//     });
//   }
// }
