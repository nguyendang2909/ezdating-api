import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { UsersModule } from '../users/users.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';

@Module({
  imports: [EncryptionsModule, UsersModule],
  providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
