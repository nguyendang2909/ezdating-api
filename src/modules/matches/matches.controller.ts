import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
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
  public async createOne(
    @Body() payload: CreateMatchDto,
    @Client() client: ClientData,
  ) {
    return {
      type: 'createMatch',
      data: await this.service.createOne(payload, client),
    };
  }

  @Delete('/cancel/:id')
  public async cancel(
    @Param('id') id: string,
    @Client() clientData: ClientData,
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

  @Get('/:id')
  public async findOneById(
    @Param('id') id: string,
    @Client() clientData: ClientData,
  ) {
    return await this.service.findOneOrFailById(id, clientData);
  }
}
