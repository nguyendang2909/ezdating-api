import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  CurrentUser,
  UserId,
} from '../../commons/decorators/current-user-id.decorator';
import { FindManyMessagesByConversationIdDto } from '../messages/dto/find-many-messages.dto';
import { User } from '../users/entities/user.entity';
import { ConversationsService } from './conversations.service';
import { FindManyConversations } from './dto/find-many-conversations.dto';

@Controller('/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('/')
  public async findMany(
    @Query() queryParams: FindManyConversations,
    @UserId() userId: string,
  ) {
    return await this.conversationsService.findMany(queryParams, userId);
  }

  @Get('/:id/messages')
  public async findManyMessages(
    @Param('id') id: string,
    @Query() queryParams: FindManyMessagesByConversationIdDto,
    @CurrentUser() currentUser: User,
  ) {
    return {
      type: 'messageByConversation',
      ...(await this.conversationsService.findManyMessagesByConversationId(
        id,
        queryParams,
        currentUser,
      )),
    };
  }
}
