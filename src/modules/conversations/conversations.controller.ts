import { Controller, Get, Param, Query } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { ConversationsService } from './conversations.service';
import { FindManyConversations } from './dto/find-many-conversations.dto';

@Controller('/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('/')
  public async findMany(
    @Query() queryParams: FindManyConversations,
    @Client() clientData: ClientData,
  ) {
    return await this.conversationsService.findMany(queryParams, clientData);
  }

  @Get('/:id')
  public async findOneById(
    @Param('id') id: string,
    @Client() clientData: ClientData,
  ) {
    return {
      type: 'conversation',
      data: await this.conversationsService.findOneOrFailById(id, clientData),
    };
  }
}
