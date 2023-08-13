import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';

import { MediaFileModel } from './media-file.model';
import { MessageModel } from './message.model';
import { RelationshipModel } from './relationship.model';
import { MediaFile } from './schemas/media-file.schema';
import { Message } from './schemas/message.schema';
import {
  Relationship,
  RelationshipSchema,
} from './schemas/relationship.schema';
import { SignedDevice } from './schemas/signed-device.schema';
import { User } from './schemas/user.schema';
import { SignedDeviceModel } from './signed-device.model';
import { UserModel } from './user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
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
      { name: User.name, schema: SchemaFactory.createForClass(User) },
    ]),
  ],
  exports: [
    MediaFileModel,
    MessageModel,
    RelationshipModel,
    SignedDeviceModel,
    UserModel,
  ],
  controllers: [],
  providers: [
    MediaFileModel,
    MessageModel,
    RelationshipModel,
    SignedDeviceModel,
    UserModel,
  ],
})
export class ModelsModule {}
