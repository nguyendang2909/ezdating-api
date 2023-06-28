import { Controller, Get, Param } from '@nestjs/common';

import { StatesService } from './states.service';

@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Get()
  findAll() {
    return this.statesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statesService.findOne(+id);
  }
}
