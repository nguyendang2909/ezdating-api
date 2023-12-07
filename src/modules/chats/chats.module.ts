import { Module } from '@nestjs/common';

import { ChatsGateway } from './chats.gateway';
import { ChatsHandler } from './chats.handler';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service';

@Module({
  exports: [ChatsGateway],
  providers: [ChatsGateway, ChatsService, ChatsConnectionService, ChatsHandler],
})
export class ChatsModule {}
