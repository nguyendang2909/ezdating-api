import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { RESPONSE_TYPES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { CreateMatchDto, FindManyMatchesQuery } from './dto';
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

  @Post('/unmatch/:id')
  public async unmatch(
    @Param('id') id: string,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'unmatch',
      data: await this.service.unmatch(id, clientData),
    };
  }

  @Get('/')
  public async findMatched(
    @Query() queryParams: FindManyMatchesQuery,
    @Client() clientData: ClientData,
  ) {
    return await this.service.findMany(queryParams, clientData);
  }

  @Get('/target-user/:id')
  public async findOneByTargetUserId(
    @Param('id') targetUserId: string,
    @Client() client: ClientData,
  ) {
    return {
      type: RESPONSE_TYPES.MATCH,
      data: await this.service.findOneByTargetUserId(targetUserId, client),
    };
  }

  @Get('/:id')
  public async findOneById(
    @Param('id') id: string,
    @Client() clientData: ClientData,
  ) {
    return {
      type: RESPONSE_TYPES.MATCH,
      data: await this.service.findOneOrFailById(id, clientData),
    };
  }
}
