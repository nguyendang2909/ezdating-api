import { Model } from 'mongoose';
import { CommonModel } from './bases/common-model';
import { SignedDevice, SignedDeviceDocument } from './schemas/signed-device.schema';
export declare class SignedDeviceModel extends CommonModel<SignedDevice> {
    readonly model: Model<SignedDeviceDocument>;
    constructor(model: Model<SignedDeviceDocument>);
}
