import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { RESPONSE_TYPES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { CreateMatchDto, FindManyMatchesQuery } from './dto';
import { MatchesReadService } from './services/matches-read.service';
import { MatchesWriteService } from './services/matches-write.service';

@Controller('/matches')
@ApiTags('/matches')
@ApiBearerAuth('JWT')
export class MatchesController {
  constructor(
    private readonly writeService: MatchesWriteService,
    private readonly readService: MatchesReadService,
  ) {}

  @Post('/')
  public async createOne(
    @Body() payload: CreateMatchDto,
    @Client() client: ClientData,
  ) {
    return {
      type: RESPONSE_TYPES.CREATE_MATCH,
      data: await this.writeService.createOne(payload, client),
    };
  }

  @Post('/unmatch/:id')
  public async unmatch(
    @Param('id') id: string,
    @Client() clientData: ClientData,
  ) {
    return {
      type: RESPONSE_TYPES.UNMATCH,
      data: await this.writeService.unmatch(id, clientData),
    };
  }

  @Get('/')
  public async findMatched(
    @Query() queryParams: FindManyMatchesQuery,
    @Client() clientData: ClientData,
  ) {
    const findResults = await this.readService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: RESPONSE_TYPES.MATCHES,
      data: findResults,
      pagination: this.readService.getPagination(findResults),
    };
  }

  @Get('/target-user/:id')
  public async findOneByTargetUserId(
    @Param('id') targetUserId: string,
    @Client() client: ClientData,
  ) {
    return {
      type: RESPONSE_TYPES.MATCH,
      data: await this.readService.findOneByTargetUserId(targetUserId, client),
    };
  }

  @Get('/:id')
  public async findOneById(
    @Param('id') id: string,
    @Client() clientData: ClientData,
  ) {
    return {
      type: RESPONSE_TYPES.MATCH,
      data: await this.readService.findOneOrFailById(id, clientData),
    };
  }
}
