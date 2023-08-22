import { Controller, Get, Query } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { FindManyMessagesDto } from './dto/find-many-messages.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  public async findMany(
    @Query() queryParams: FindManyMessagesDto,
    @Client() clientData: ClientData,
  ) {
    return await this.messagesService.findMany(queryParams, clientData);
  }
}
