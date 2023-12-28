import { ApiWriteMeService } from '../../commons/services/api/api-update-me.base.service';
import { ClientData } from '../auth/auth.type';
import { SignedDevice } from '../models';
import { SignedDeviceModel } from '../models/signed-device.model';
import { UpdateSignedDeviceDto } from './dto/update-logged-device.dto';
export declare class SignedDevicesService extends ApiWriteMeService<SignedDevice, undefined, UpdateSignedDeviceDto> {
    private readonly signedDeviceModel;
    constructor(signedDeviceModel: SignedDeviceModel);
    updateOne(payload: UpdateSignedDeviceDto, client: ClientData): Promise<void>;
}
