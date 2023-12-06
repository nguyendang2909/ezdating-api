import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { RESPONSE_TYPES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { ReadMessageDto } from './dto';
import { FindManyMessagesQuery } from './dto/find-many-messages.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/read')
  public async read(
    @Body() payload: ReadMessageDto,
    @Client() clientData: ClientData,
  ) {
    await this.messagesService.read(payload, clientData);
  }

  @Get()
  public async findMany(
    @Query() queryParams: FindManyMessagesQuery,
    @Client() clientData: ClientData,
  ) {
    const findResults = await this.messagesService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: RESPONSE_TYPES.DELETE_PHOTO,
      _matchId: queryParams.matchId,
      data: findResults,
      pagination: this.messagesService.getPagination(findResults),
    };
  }
}
