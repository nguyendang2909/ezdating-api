import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { CreateMatchDto } from './dto/create-match.dto';
import { FindManyMatchesQuery } from './dto/find-matches-relationships.dto';
import { MatchesService } from './matches.service';

@Controller('/matches')
@ApiTags('/matches')
@ApiBearerAuth('JWT')
export class MatchesController {
  constructor(private readonly service: MatchesService) {}

  @Post('/')
  public async createMatch(
    payload: CreateMatchDto,
    @Client() client: ClientData,
  ) {
    return {
      type: 'createMatch',
      data: await this.service.create(payload, client),
    };
  }

  @Post('/cancel/:id')
  public async cancel(
    @Client() clientData: ClientData,
    @Param('id') id: string,
  ) {
    return {
      type: 'cancelMatched',
      data: await this.service.cancel(id, clientData),
    };
  }

  @Get('/')
  public async findMatched(
    @Query() queryParams: FindManyMatchesQuery,
    @Client() clientData: ClientData,
  ) {
    return await this.service.findMany(queryParams, clientData);
  }
}
