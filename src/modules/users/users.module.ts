import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { ModelsModule } from '../models/models.module';
import { NearbyUsersService } from './nearby-users.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [EncryptionsModule, ModelsModule, EncryptionsModule],
  exports: [],
  controllers: [UsersController],
  providers: [UsersService, NearbyUsersService],
})
export class UsersModule {}
