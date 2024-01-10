import { Global, Module } from '@nestjs/common';

import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service';
import { ChatsSendMessageService } from './services/chats-send-message.service';

@Global()
@Module({
  exports: [ChatsGateway],
  providers: [
    ChatsGateway,
    ChatsService,
    ChatsConnectionService,
    ChatsSendMessageService,
  ],
})
export class ChatsModule {}
