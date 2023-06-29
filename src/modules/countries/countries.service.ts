import { Injectable } from '@nestjs/common';
import Axios from 'axios';

@Injectable()
export class CountriesService {
  constructor() {}

  private readonly locationsService = Axios.create({
    baseURL: 'https://api.countrystatecity.in/',
    headers: {
      'X-CSCAPI-KEY': process.env.COUNTRY_STATE_CITY_API_KEY,
    },
  });

  public async findAll() {
    const data = await this.locationsService.get('/v1/countries');

    return data.data;
  }

  public async findOne(iso2: string) {
    const data = await this.locationsService.get(`/v1/countries/${iso2}`);

    return data.data;
  }

  public async findAllStatesByCountryIso2(iso2: string) {
    const data = await this.locationsService.get(
      `/v1/countries/${iso2}/states`,
    );

    return data.data;
  }
}
