import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';

import { CoinAttendanceModel } from './coin-attendance.model';
import { MediaFileModel } from './media-file.model';
import { MessageModel } from './message.model';
import { RelationshipModel } from './relationship.model';
import {
  CoinAttendance,
  CoinAttendanceSchema,
} from './schemas/coin-attendance.schema';
import { MediaFile } from './schemas/media-file.schema';
import { Message } from './schemas/message.schema';
import {
  Relationship,
  RelationshipSchema,
} from './schemas/relationship.schema';
import { SignedDevice } from './schemas/signed-device.schema';
import { User, UserSchema } from './schemas/user.schema';
import { SignedDeviceModel } from './signed-device.model';
import { UserModel } from './user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoinAttendance.name, schema: CoinAttendanceSchema },
      { name: MediaFile.name, schema: SchemaFactory.createForClass(MediaFile) },
      { name: Message.name, schema: SchemaFactory.createForClass(Message) },
      {
        name: Relationship.name,
        schema: RelationshipSchema,
      },
      {
        name: SignedDevice.name,
        schema: SchemaFactory.createForClass(SignedDevice),
      },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [
    CoinAttendanceModel,
    MediaFileModel,
    MessageModel,
    RelationshipModel,
    SignedDeviceModel,
    UserModel,
  ],
  controllers: [],
  providers: [
    CoinAttendanceModel,
    MediaFileModel,
    MessageModel,
    RelationshipModel,
    SignedDeviceModel,
    UserModel,
  ],
})
export class ModelsModule {}
