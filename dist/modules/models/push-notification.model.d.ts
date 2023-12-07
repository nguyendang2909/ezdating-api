import { Model } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { PushNotification, PushNotificationDocument } from './schemas/push-notification.schema';
import { UserModel } from './user.model';
export declare class PushNotificationModel extends CommonModel<PushNotification> {
    readonly model: Model<PushNotificationDocument>;
    private readonly userModel;
    constructor(model: Model<PushNotificationDocument>, userModel: UserModel);
}
