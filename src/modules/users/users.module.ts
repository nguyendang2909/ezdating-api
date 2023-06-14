import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { UsersAuthUtil } from './auth-users.util';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './users-entity.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EncryptionsModule],
  exports: [UserEntity, UsersAuthUtil],
  controllers: [UsersController],
  providers: [UsersService, UserEntity, UsersAuthUtil],
})
export class UsersModule {}
