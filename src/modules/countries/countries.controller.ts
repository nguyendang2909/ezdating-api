import { Controller, Get, Param } from '@nestjs/common';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @IsPublicEndpoint()
  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @IsPublicEndpoint()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(+id);
  }
}
