import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsHandler } from './chats.handler';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service';

@Module({
  imports: [EncryptionsModule],
  exports: [ChatsGateway],
  providers: [ChatsGateway, ChatsService, ChatsConnectionService, ChatsHandler],
})
export class ChatsModule {}
