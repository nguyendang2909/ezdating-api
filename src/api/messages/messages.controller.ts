import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { RESPONSE_TYPES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { ReadMessageDto } from './dto';
import { FindManyMessagesQuery } from './dto/find-many-messages.dto';
import { MessagesReadService } from './services/messages-read.service';
import { MessagesWriteService } from './services/messages-write.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly readService: MessagesReadService,
    private readonly writeService: MessagesWriteService,
  ) {}

  @Post('/read')
  public async read(
    @Body() payload: ReadMessageDto,
    @Client() clientData: ClientData,
  ) {
    await this.writeService.read(payload, clientData);
  }

  @Get()
  public async findMany(
    @Query() queryParams: FindManyMessagesQuery,
    @Client() clientData: ClientData,
  ) {
    const findResults = await this.readService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: RESPONSE_TYPES.DELETE_PHOTO,
      _matchId: queryParams.matchId,
      data: findResults,
      pagination: this.readService.getPagination(findResults),
    };
  }
}
