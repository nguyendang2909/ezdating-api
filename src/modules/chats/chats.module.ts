import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { ModelsModule } from '../models/models.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service ';

@Module({
  imports: [EncryptionsModule, ModelsModule],
  providers: [ChatsGateway, ChatsService, ChatsConnectionService],
})
export class ChatsModule {}
