import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinAttendanceModel } from './coin-attendance.model';
import { LikeModel } from './like.model';
import { MatchModel } from './match.model';
import { MessageModel } from './message.model';
import {
  CoinAttendance,
  CoinAttendanceSchema,
} from './schemas/coin-attendance.schema';
import { Like, LikeSchema } from './schemas/like.schema';
import { Match, MatchSchema } from './schemas/match.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import {
  PushNotification,
  PushNotificationSchema,
} from './schemas/push-notification.schema';
import {
  SignedDevice,
  SignedDeviceSchema,
} from './schemas/signed-device.schema';
import { User, UserSchema } from './schemas/user.schema';
import { View, ViewSchema } from './schemas/view.schema';
import { SignedDeviceModel } from './signed-device.model';
import { UserModel } from './user.model';
import { ViewModel } from './view.model';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoinAttendance.name, schema: CoinAttendanceSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Match.name, schema: MatchSchema },
      { name: Message.name, schema: MessageSchema },
      { name: SignedDevice.name, schema: SignedDeviceSchema },
      { name: User.name, schema: UserSchema },
      { name: View.name, schema: ViewSchema },
      { name: PushNotification.name, schema: PushNotificationSchema },
    ]),
  ],
  exports: [
    CoinAttendanceModel,
    LikeModel,
    MatchModel,
    MessageModel,
    SignedDeviceModel,
    UserModel,
    ViewModel,
  ],
  controllers: [],
  providers: [
    CoinAttendanceModel,
    LikeModel,
    MatchModel,
    MessageModel,
    SignedDeviceModel,
    UserModel,
    ViewModel,
  ],
})
export class ModelsModule {}
