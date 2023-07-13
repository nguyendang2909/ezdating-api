import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountriesModule } from '../countries/countries.module';
import { EncryptionsModule } from '../encryptions/encryptions.module';
import { StatesModule } from '../states/states.module';
import { UploadFilesModule } from '../upload-files/upload-files.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './users-entity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EncryptionsModule,
    forwardRef(() => UploadFilesModule),
    StatesModule,
    CountriesModule,
  ],
  exports: [UserEntity],
  controllers: [UsersController],
  providers: [UsersService, UserEntity],
})
export class UsersModule {}
