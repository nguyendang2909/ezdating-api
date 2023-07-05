import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { MessagesModule } from '../messages/messages.module';
import { RelationshipsModule } from '../relationships/relationships.module';
import { UsersModule } from '../users/users.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service ';

@Module({
  imports: [
    EncryptionsModule,
    UsersModule,
    RelationshipsModule,
    MessagesModule,
  ],
  providers: [ChatsGateway, ChatsService, ChatsConnectionService],
})
export class ChatsModule {}
