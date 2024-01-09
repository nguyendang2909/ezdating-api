import { Controller, Get, Param } from '@nestjs/common';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { CountriesService } from './countries.service';
import { FindOneCountryParamsDto } from './dto/find-one-country-params.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @IsPublicEndpoint()
  @Get()
  public async findAll() {
    return { type: 'countries', data: await this.countriesService.findAll() };
  }

  @IsPublicEndpoint()
  @Get(':id')
  public async findOne(@Param() params: FindOneCountryParamsDto) {
    return {
      type: 'country',
      data: await this.countriesService.findOneOrFail(params.id),
    };
  }

  //   @IsPublicEndpoint()
  //   @Get(':id/states')
  //   public async findStatesByCountry(@Param() params: FindOneCountryParamsDto) {
  //     return {
  //       type: 'states',
  //       data: await this.countriesService.findCountryAndStates(params.id),
  //     };
  //   }
}
