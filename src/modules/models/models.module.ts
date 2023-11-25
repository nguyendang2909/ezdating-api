import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BasicProfileModel } from './basic-profile.model';
import { CoinAttendanceModel } from './coin-attendance.model';
import { CountryModel } from './country.model';
import { LikeModel } from './like.model';
import { MatchModel } from './match.model';
import { MediaFileModel } from './media-file.model';
import { MessageModel } from './message.model';
import { ProfileModel } from './profile.model';
import { ProfileFilterModel } from './profile-filter.model';
import {
  BasicProfile,
  BasicProfileSchema,
  Country,
  CountrySchema,
  ProfileFilter,
  ProfileFilterSchema,
  State,
  StateSchema,
  TrashLike,
  TrashLikeSchema,
  TrashMatch,
  TrashMatchSchema,
  TrashMediaFile,
  TrashMediaFileSchema,
  TrashMessage,
  TrashMessageSchema,
  TrashProfile,
  TrashProfileFilter,
  TrashProfileFilterSchema,
  TrashProfileSchema,
  TrashUser,
  TrashUserSchema,
  TrashView,
  TrashViewSchema,
} from './schemas';
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
import { StateModel } from './state.model';
import {
  TrashLikeModel,
  TrashMatchModel,
  TrashMediaFileModel,
  TrashMessageModel,
  TrashProfileFilterModel,
  TrashProfileModel,
  TrashUserModel,
  TrashViewModel,
} from './trash';
import { UserModel } from './user.model';
import { ViewModel } from './view.model';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoinAttendance.name, schema: CoinAttendanceSchema },
      { name: BasicProfile.name, schema: BasicProfileSchema },
      { name: Country.name, schema: CountrySchema },
      { name: Like.name, schema: LikeSchema },
      { name: Match.name, schema: MatchSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: ProfileFilter.name, schema: ProfileFilterSchema },
      { name: SignedDevice.name, schema: SignedDeviceSchema },
      { name: State.name, schema: StateSchema },
      { name: User.name, schema: UserSchema },
      { name: View.name, schema: ViewSchema },
      { name: PushNotification.name, schema: PushNotificationSchema },
      { name: MediaFile.name, schema: MediaFileSchema },

      { name: TrashLike.name, schema: TrashLikeSchema },
      { name: TrashMatch.name, schema: TrashMatchSchema },
      { name: TrashMediaFile.name, schema: TrashMediaFileSchema },
      { name: TrashMessage.name, schema: TrashMessageSchema },
      { name: TrashProfile.name, schema: TrashProfileSchema },
      { name: TrashProfileFilter.name, schema: TrashProfileFilterSchema },
      { name: TrashUser.name, schema: TrashUserSchema },
      { name: TrashView.name, schema: TrashViewSchema },
    ]),
  ],
  exports: [
    BasicProfileModel,
    CoinAttendanceModel,
    CountryModel,
    LikeModel,
    MatchModel,
    MediaFileModel,
    MessageModel,
    ProfileModel,
    ProfileFilterModel,
    SignedDeviceModel,
    StateModel,
    UserModel,
    ViewModel,

    TrashLikeModel,
    TrashMatchModel,
    TrashMediaFileModel,
    TrashMessageModel,
    TrashProfileModel,
    TrashProfileFilterModel,
    TrashUserModel,
    TrashViewModel,
  ],
  controllers: [],
  providers: [
    BasicProfileModel,
    CoinAttendanceModel,
    CountryModel,
    LikeModel,
    MatchModel,
    MessageModel,
    ProfileModel,
    ProfileFilterModel,
    SignedDeviceModel,
    StateModel,
    UserModel,
    ViewModel,
    MediaFileModel,

    TrashLikeModel,
    TrashMatchModel,
    TrashMediaFileModel,
    TrashMessageModel,
    TrashProfileModel,
    TrashProfileFilterModel,
    TrashUserModel,
    TrashViewModel,
  ],
})
export class ModelsModule {}
