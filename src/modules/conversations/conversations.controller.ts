import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  CurrentUser,
  UserId,
} from '../../commons/decorators/current-user-id.decorator';
import { FindManyMessagesByRoomIdDto } from '../messages/dto/find-many-messages.dto';
import { User } from '../users/entities/user.entity';
import { ConversationsService } from './conversations.service';
import { FindManyConversations } from './dto/find-many-rooms.dto';

@Controller('/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('/')
  public async findManyRooms(
    @Query() queryParams: FindManyConversations,
    @UserId() userId: string,
  ) {
    return {
      type: 'conversations',
      ...(await this.conversationsService.findManyRooms(queryParams, userId)),
    };
  }

  @Get('/:id/messages')
  public async findManyMessages(
    @Param('id') id: string,
    @Query() queryParams: FindManyMessagesByRoomIdDto,
    @CurrentUser() currentUser: User,
  ) {
    return {
      type: 'messageByConversation',
      ...(await this.conversationsService.findManyMessagesByRoomId(
        id,
        queryParams,
        currentUser,
      )),
    };
  }
}
