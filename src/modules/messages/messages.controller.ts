import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
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
    return await this.messagesService.read(payload, clientData);
  }

  @Get()
  public async findMany(
    @Query() queryParams: FindManyMessagesQuery,
    @Client() clientData: ClientData,
  ) {
    return await this.messagesService.findMany(queryParams, clientData);
  }
}
