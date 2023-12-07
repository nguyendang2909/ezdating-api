import { ApiService } from '../../commons/services/api.service';
import { ClientData } from '../auth/auth.type';
import { SignedDeviceModel } from '../models/signed-device.model';
import { UpdateSignedDeviceDto } from './dto/update-logged-device.dto';
export declare class SignedDevicesService extends ApiService {
    private readonly signedDeviceModel;
    constructor(signedDeviceModel: SignedDeviceModel);
    updateOne(payload: UpdateSignedDeviceDto, client: ClientData): Promise<void>;
}
