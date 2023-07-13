import { Module } from '@nestjs/common';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { EntitiesModule } from '../entities/entities.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [EncryptionsModule, EntitiesModule],
  exports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
