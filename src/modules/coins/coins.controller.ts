import { Controller, Delete, Get, Param } from '@nestjs/common';

import { CoinsService } from './coins.service';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Get()
  findAll() {
    return this.coinsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coinsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coinsService.remove(+id);
  }
}
