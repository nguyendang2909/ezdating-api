"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const basic_profile_model_1 = require("./basic-profile.model");
const coin_attendance_model_1 = require("./coin-attendance.model");
const country_model_1 = require("./country.model");
const match_model_1 = require("./match.model");
const media_file_model_1 = require("./media-file.model");
const message_model_1 = require("./message.model");
const mongo_connection_1 = require("./mongo.connection");
const profile_model_1 = require("./profile.model");
const profile_filter_model_1 = require("./profile-filter.model");
const schemas_1 = require("./schemas");
const coin_attendance_schema_1 = require("./schemas/coin-attendance.schema");
const match_schema_1 = require("./schemas/match.schema");
const media_file_schema_1 = require("./schemas/media-file.schema");
const message_schema_1 = require("./schemas/message.schema");
const profile_schema_1 = require("./schemas/profile.schema");
const push_notification_schema_1 = require("./schemas/push-notification.schema");
const signed_device_schema_1 = require("./schemas/signed-device.schema");
const user_schema_1 = require("./schemas/user.schema");
const view_schema_1 = require("./schemas/view.schema");
const signed_device_model_1 = require("./signed-device.model");
const state_model_1 = require("./state.model");
const trash_1 = require("./trash");
const user_model_1 = require("./user.model");
const view_model_1 = require("./view.model");
let ModelsModule = class ModelsModule {
};
ModelsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: coin_attendance_schema_1.CoinAttendance.name, schema: coin_attendance_schema_1.CoinAttendanceSchema },
                { name: schemas_1.BasicProfile.name, schema: schemas_1.BasicProfileSchema },
                { name: schemas_1.Country.name, schema: schemas_1.CountrySchema },
                { name: match_schema_1.Match.name, schema: match_schema_1.MatchSchema },
                { name: message_schema_1.Message.name, schema: message_schema_1.MessageSchema },
                { name: profile_schema_1.Profile.name, schema: profile_schema_1.ProfileSchema },
                { name: schemas_1.ProfileFilter.name, schema: schemas_1.ProfileFilterSchema },
                { name: signed_device_schema_1.SignedDevice.name, schema: signed_device_schema_1.SignedDeviceSchema },
                { name: schemas_1.State.name, schema: schemas_1.StateSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: view_schema_1.View.name, schema: view_schema_1.ViewSchema },
                { name: push_notification_schema_1.PushNotification.name, schema: push_notification_schema_1.PushNotificationSchema },
                { name: media_file_schema_1.MediaFile.name, schema: media_file_schema_1.MediaFileSchema },
                { name: schemas_1.TrashMatch.name, schema: schemas_1.TrashMatchSchema },
                { name: schemas_1.TrashMediaFile.name, schema: schemas_1.TrashMediaFileSchema },
                { name: schemas_1.TrashMessage.name, schema: schemas_1.TrashMessageSchema },
                { name: schemas_1.TrashProfile.name, schema: schemas_1.TrashProfileSchema },
                { name: schemas_1.TrashProfileFilter.name, schema: schemas_1.TrashProfileFilterSchema },
                { name: schemas_1.TrashUser.name, schema: schemas_1.TrashUserSchema },
            ]),
        ],
        exports: [
            basic_profile_model_1.BasicProfileModel,
            coin_attendance_model_1.CoinAttendanceModel,
            country_model_1.CountryModel,
            match_model_1.MatchModel,
            media_file_model_1.MediaFileModel,
            message_model_1.MessageModel,
            profile_model_1.ProfileModel,
            profile_filter_model_1.ProfileFilterModel,
            signed_device_model_1.SignedDeviceModel,
            state_model_1.StateModel,
            user_model_1.UserModel,
            view_model_1.ViewModel,
            trash_1.TrashMatchModel,
            trash_1.TrashMediaFileModel,
            trash_1.TrashMessageModel,
            trash_1.TrashProfileModel,
            trash_1.TrashProfileFilterModel,
            trash_1.TrashUserModel,
            mongo_connection_1.MongoConnection,
        ],
        controllers: [],
        providers: [
            basic_profile_model_1.BasicProfileModel,
            coin_attendance_model_1.CoinAttendanceModel,
            country_model_1.CountryModel,
            match_model_1.MatchModel,
            message_model_1.MessageModel,
            profile_model_1.ProfileModel,
            profile_filter_model_1.ProfileFilterModel,
            signed_device_model_1.SignedDeviceModel,
            state_model_1.StateModel,
            user_model_1.UserModel,
            view_model_1.ViewModel,
            media_file_model_1.MediaFileModel,
            trash_1.TrashMatchModel,
            trash_1.TrashMediaFileModel,
            trash_1.TrashMessageModel,
            trash_1.TrashProfileModel,
            trash_1.TrashProfileFilterModel,
            trash_1.TrashUserModel,
            mongo_connection_1.MongoConnection,
        ],
    })
], ModelsModule);
exports.ModelsModule = ModelsModule;
//# sourceMappingURL=models.module.js.map