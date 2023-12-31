import { Controller, Get, Query } from '@nestjs/common';

import { Client } from '../../commons/decorators/current-user-id.decorator';
import { RESPONSE_TYPES } from '../../constants';
import { ClientData } from '../auth/auth.type';
import { FindManyConversationsQuery } from './dto/find-many-conversations.dto';
import { ConversationsReadService } from './services/conversations-read.service';

@Controller('/conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsReadService,
  ) {}

  @Get('/')
  public async findMany(
    @Query() queryParams: FindManyConversationsQuery,
    @Client() clientData: ClientData,
  ) {
    const findResults = await this.conversationsService.findMany(
      queryParams,
      clientData,
    );
    return {
      type: RESPONSE_TYPES.CONVERSATIONS,
      data: findResults,
      pagination: this.conversationsService.getPagination(findResults),
    };
  }

  // @Get('/:id')
  // public async findOneById(
  //   @Param('id') id: string,
  //   @Client() clientData: ClientData,
  // ) {
  //   return {
  //     type: 'conversation',
  //     data: await this.conversationsService.findOneOrFailById(id, clientData),
  //   };
  // }
}
