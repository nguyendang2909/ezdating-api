import { ClientData } from '../auth/auth.type';
import { UpdateSignedDeviceDto } from './dto';
import { SignedDevicesService } from './signed-devices.service';
export declare class SignedDevicesController {
    private readonly service;
    constructor(service: SignedDevicesService);
    update(payload: UpdateSignedDeviceDto, client: ClientData): Promise<{
        type: string;
    }>;
}
