import { Module } from '@nestjs/common';

import { ChatsModule } from '../../chats/chats.module';
import { ModelsModule } from '../../models/models.module';
import { LikesController } from './likes.controller';
import { LikedMeReadService } from './services/liked-me-read-service';
import { LikesWriteService } from './services/likes-write.service';

@Module({
  imports: [ModelsModule, ChatsModule],
  exports: [],
  controllers: [LikesController],
  providers: [LikedMeReadService, LikesWriteService],
})
export class LikesModule {}
