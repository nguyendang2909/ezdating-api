import { Injectable } from '@nestjs/common';

import { ApiService } from '../../commons/services/api.service';
import { ClientData } from '../auth/auth.type';
import { SignedDeviceModel } from '../models/signed-device.model';
import { UpdateSignedDeviceDto } from './dto/update-logged-device.dto';

@Injectable()
export class SignedDevicesService extends ApiService {
  constructor(private readonly signedDeviceModel: SignedDeviceModel) {
    super();
  }

  async update(payload: UpdateSignedDeviceDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    const signedDevice = await this.signedDeviceModel.findOneOrFail({
      _userId: _currentUserId,
      refreshToken: payload.refreshToken,
    });
    await signedDevice.updateOne({
      $set: {
        token: payload.deviceToken,
        platform: payload.devicePlatform,
      },
    });
  }
}
