import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
import { FindOneCountryParamsDto } from '../countries/dto/find-one-country-params.dto';
import { FindAllStatesByCountryIso2Query } from './dto';
import { StatesService } from './states.service';

@Controller('states')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @IsPublicEndpoint()
  @Get()
  public async findAllByCountryIso2(
    @Query() queryParrams: FindAllStatesByCountryIso2Query,
  ) {
    return {
      type: 'states',
      data: await this.statesService.findAllByCountryIso2(queryParrams),
    };
  }

  @IsPublicEndpoint()
  @Get(':id')
  public async findOne(@Param() params: FindOneCountryParamsDto) {
    return {
      type: 'country',
      data: await this.statesService.findOneOrFail(params.id),
    };
  }
}
