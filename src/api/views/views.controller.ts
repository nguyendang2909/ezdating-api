import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { FindManyViewsQuery } from './dto';
import { SendViewDto } from './dto/send-view.dto';
import { ViewsReadService } from './services/views-read.service';
import { ViewsWriteService } from './services/views-write.service';

@Controller('/views')
@ApiTags('/views')
@ApiBearerAuth('JWT')
export class ViewsController {
  constructor(
    private readonly readService: ViewsReadService,
    private readonly writeService: ViewsWriteService,
  ) {}

  @Post('/')
  public async send(
    @Body() payload: SendViewDto,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'send_view',
      data: await this.writeService.send(payload, clientData),
    };
  }

  @Get('/')
  public async findMany(
    @Query() queryParams: FindManyViewsQuery,
    @Client() clientData: ClientData,
  ) {
    const findResults = await this.readService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: 'views',
      data: findResults,
      pagination: this.readService.getPagination(findResults),
    };
  }
}
