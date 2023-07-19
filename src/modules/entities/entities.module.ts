import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoinHistoryModel } from './coinHistory.model';
import { CountryModel } from './country.model';
import { CoinHistory } from './entities/coin-history.entity';
import { Country } from './entities/country.entity';
import { Job } from './entities/job.entity';
import { LoggedDevice } from './entities/logged-device.entity';
import { Message } from './entities/message.entity';
import { Relationship } from './entities/relationship.entity';
import { State } from './entities/state.entity';
import { UploadFile } from './entities/upload-file.entity';
import { User } from './entities/user.entity';
import { JobModel } from './job.model';
import { LoggedDeviceModel } from './logged-device.model';
import { MessageModel } from './message.model';
import { RelationshipModel } from './relationship-entity.model';
import { StateModel } from './state.model';
import { UploadFileModel } from './upload-file.model';
import { UserModel } from './users.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CoinHistory,
      Country,
      Job,
      LoggedDevice,
      Message,
      Relationship,
      State,
      UploadFile,
      User,
    ]),
  ],
  exports: [
    CountryModel,
    CoinHistoryModel,
    JobModel,
    LoggedDeviceModel,
    MessageModel,
    RelationshipModel,
    StateModel,
    UploadFileModel,
    UserModel,
  ],
  controllers: [],
  providers: [
    CountryModel,
    CoinHistoryModel,
    JobModel,
    LoggedDeviceModel,
    MessageModel,
    RelationshipModel,
    StateModel,
    UploadFileModel,
    UserModel,
  ],
})
export class EntitiesModule {}
