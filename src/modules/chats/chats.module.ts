import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { EntitiesModule } from '../entities/entities.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service ';

@Module({
  imports: [EncryptionsModule, EntitiesModule],
  providers: [ChatsGateway, ChatsService, ChatsConnectionService],
})
export class ChatsModule {}
