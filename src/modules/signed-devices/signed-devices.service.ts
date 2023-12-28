import { Injectable } from '@nestjs/common';

import { ApiWriteMeService } from '../../commons/services/api/api-update-me.base.service';
import { ClientData } from '../auth/auth.type';
import { SignedDevice } from '../models';
import { SignedDeviceModel } from '../models/signed-device.model';
import { UpdateSignedDeviceDto } from './dto/update-logged-device.dto';

@Injectable()
export class SignedDevicesService extends ApiWriteMeService<
  SignedDevice,
  undefined,
  UpdateSignedDeviceDto
> {
  constructor(private readonly signedDeviceModel: SignedDeviceModel) {
    super();
  }

  async updateOne(payload: UpdateSignedDeviceDto, client: ClientData) {
    const { _currentUserId } = this.getClient(client);
    const signedDevice = await this.signedDeviceModel.findOneOrFail({
      _userId: _currentUserId,
      refreshToken: payload.refreshToken,
    });
    if (
      signedDevice.token === payload.deviceToken &&
      signedDevice.platform === payload.devicePlatform
    ) {
      return;
    }
    await this.signedDeviceModel.deleteMany({
      deviceToken: payload.deviceToken,
      devicePlatform: payload.devicePlatform,
    });
    await this.signedDeviceModel.updateOneOrFailById(signedDevice._id, {
      $set: {
        token: payload.deviceToken,
        platform: payload.devicePlatform,
      },
    });
  }
}
