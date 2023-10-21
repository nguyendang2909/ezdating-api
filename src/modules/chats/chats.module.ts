import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service';

@Module({
  imports: [EncryptionsModule],
  exports: [ChatsGateway],
  providers: [ChatsGateway, ChatsService, ChatsConnectionService],
})
export class ChatsModule {}
