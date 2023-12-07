import { Types } from 'mongoose';
import { SendPushNotificationByProfileOptions, SendPushNotificationContent, SendPushNotificationPayload } from '../../types';
import { Profile } from '../models';
import { SignedDevice } from '../models/schemas/signed-device.schema';
import { SignedDeviceModel } from '../models/signed-device.model';
import { AndroidPushNotificationsService } from './android-push-notifications.service';
import { IosPushNotificationsService } from './ios-push-notifications.service';
export declare class PushNotificationsService {
    private readonly iosService;
    private readonly androidService;
    private readonly signedDeviceModel;
    constructor(iosService: IosPushNotificationsService, androidService: AndroidPushNotificationsService, signedDeviceModel: SignedDeviceModel);
    send(payload: SendPushNotificationPayload): Promise<string | undefined>;
    sendByDevices(devices: SignedDevice[], payload: SendPushNotificationContent): Promise<(string | undefined)[]>;
    sendByUserId(_userId: Types.ObjectId, payload: SendPushNotificationContent): Promise<(string | undefined)[]>;
    sendByProfile(profile: Profile, payload: SendPushNotificationContent, options?: SendPushNotificationByProfileOptions): Promise<(string | undefined)[] | undefined>;
    canPushByProfile(profile: Profile): boolean;
}
