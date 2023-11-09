import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { FindManyViewsQuery } from './dto';
import { SendViewDto } from './dto/send-view.dto';
import { ViewsService } from './views.service';

@Controller('/views')
@ApiTags('/views')
@ApiBearerAuth('JWT')
export class ViewsController {
  constructor(private readonly service: ViewsService) {}

  @Post('/')
  public async send(
    @Body() payload: SendViewDto,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'sendView',
      data: await this.service.send(payload, clientData),
    };
  }

  @Get('/')
  public async findMany(
    @Query() queryParams: FindManyViewsQuery,
    @Client() clientData: ClientData,
  ) {
    return await this.service.findMany(queryParams, clientData);
  }
}
