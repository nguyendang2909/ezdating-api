// import { Controller, Get, Param } from '@nestjs/common';

// import { IsPublicEndpoint } from '../../commons/decorators/is-public.endpoint';
// import { FindOneCountryParamsDto } from '../countries/dto/find-one-country-params.dto';
// import { StatesService } from './states.service';

// @Controller('states')
// export class StatesController {
//   constructor(private readonly statesService: StatesService) {}

//   @IsPublicEndpoint()
//   @Get()
//   public async findAll() {
//     return { type: 'countries', data: await this.statesService.findAll() };
//   }

//   @IsPublicEndpoint()
//   @Get(':id')
//   public async findOne(@Param() params: FindOneCountryParamsDto) {
//     return {
//       type: 'country',
//       data: await this.statesService.findOneOrFail(params.id),
//     };
//   }
// }
