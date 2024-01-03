import { Module } from '@nestjs/common';

import { ChatsGateway } from './chats.gateway';
import { ChatsHandler } from './chats.handler';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service';
import { ChatsSendMessageService } from './services/chats-send-message.service';

@Module({
  exports: [ChatsGateway],
  providers: [
    ChatsGateway,
    ChatsService,
    ChatsConnectionService,
    ChatsHandler,
    ChatsSendMessageService,
  ],
})
export class ChatsModule {}
