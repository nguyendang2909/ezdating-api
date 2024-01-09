import { Module } from '@nestjs/common';

import { ChatsModule } from '../../chats/chats.module';
import { ModelsModule } from '../models/models.module';
import { LikesController } from './likes.controller';
import { LikesHandler } from './likes.handler';
import { LikedMeReadService } from './services/liked-me-read-service';
import { LikesWriteService } from './services/likes-write.service';

@Module({
  imports: [ModelsModule, ChatsModule],
  exports: [],
  controllers: [LikesController],
  providers: [LikesHandler, LikedMeReadService, LikesWriteService],
})
export class LikesModule {}
