import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { ClientData } from '../auth/auth.type';
import { FindManyMessagesByConversationIdDto } from '../messages/dto/find-many-messages.dto';
import { ConversationsService } from './conversations.service';
import { FindManyConversations } from './dto/find-many-conversations.dto';

@Controller('/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('/')
  public async findMany(
    @Query() queryParams: FindManyConversations,
    @Client() clienData: ClientData,
  ) {
    return await this.conversationsService.findMany(queryParams, clienData);
  }

  @Get('/:id/messages')
  public async findManyMessages(
    @Param('id') id: string,
    @Query() queryParams: FindManyMessagesByConversationIdDto,
    @Client() clientData: ClientData,
  ) {
    return await this.conversationsService.findManyMessagesByConversationId(
      id,
      queryParams,
      clientData,
    );
  }

  @Get('/:id')
  public async findOneById(
    @Param('id') id: string,
    @Client() clientData: ClientData,
  ) {
    if (!id) {
      throw new BadRequestException();
    }

    return {
      type: 'conversation',
      data: await this.conversationsService.findOneOrFailById(id, clientData),
    };
  }
}
