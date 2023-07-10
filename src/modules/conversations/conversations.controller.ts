import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../../commons/decorators/current-user-id.decorator';
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
    @CurrentUser() currentUser: User,
  ) {
    return await this.conversationsService.findMany(queryParams, currentUser);
  }

  @Get('/:id/messages')
  public async findManyMessages(
    @Param('id') id: string,
    @Query() queryParams: FindManyMessagesByConversationIdDto,
    @CurrentUser() currentUser: User,
  ) {
    return await this.conversationsService.findManyMessagesByConversationId(
      id,
      queryParams,
      currentUser,
    );
  }

  @Get('/:id')
  public async findOneById(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    if (!id) {
      throw new BadRequestException();
    }

    return {
      type: 'conversation',
      data: await this.conversationsService.findOneOrFailById(id, currentUser),
    };
  }
}
