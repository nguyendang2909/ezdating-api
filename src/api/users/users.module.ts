import { Module } from '@nestjs/common';

import { ModelsModule } from '../../models/models.module';
import { UsersReadMeService } from './services';
import { UsersWriteMeService } from './services/users.write-me.service';
import { UsersController } from './users.controller';

@Module({
  imports: [ModelsModule],
  exports: [],
  controllers: [UsersController],
  providers: [UsersReadMeService, UsersWriteMeService],
})
export class UsersModule {}
