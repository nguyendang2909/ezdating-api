import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoinAttendanceModel } from './coin-attendance.model';
import { LikeModel } from './like.model';
import { MatchModel } from './match.model';
import { MediaFileModel } from './media-file.model';
import { MessageModel } from './message.model';
import { ProfileModel } from './profile.model';
import { ProfileFilterModel } from './profile-filter.model';
import { ProfileFilter, ProfileFilterSchema } from './schemas';
import {
  CoinAttendance,
  CoinAttendanceSchema,
} from './schemas/coin-attendance.schema';
import { Like, LikeSchema } from './schemas/like.schema';
import { Match, MatchSchema } from './schemas/match.schema';
import { MediaFile, MediaFileSchema } from './schemas/media-file.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
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
      { name: Profile.name, schema: ProfileSchema },
      { name: ProfileFilter.name, schema: ProfileFilterSchema },
      { name: SignedDevice.name, schema: SignedDeviceSchema },
      { name: User.name, schema: UserSchema },
      { name: View.name, schema: ViewSchema },
      { name: PushNotification.name, schema: PushNotificationSchema },
      { name: MediaFile.name, schema: MediaFileSchema },
    ]),
  ],
  exports: [
    CoinAttendanceModel,
    LikeModel,
    MatchModel,
    MessageModel,
    ProfileModel,
    ProfileFilterModel,
    SignedDeviceModel,
    UserModel,
    ViewModel,
    MediaFileModel,
  ],
  controllers: [],
  providers: [
    CoinAttendanceModel,
    LikeModel,
    MatchModel,
    MessageModel,
    ProfileModel,
    ProfileFilterModel,
    SignedDeviceModel,
    UserModel,
    ViewModel,
    MediaFileModel,
  ],
})
export class ModelsModule {}
