import { BadRequestException, Injectable } from '@nestjs/common';

import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
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
    const signedDevice = await this.signedDeviceModel.findOneOrFail(
      {
        _userId: _currentUserId,
        refreshToken: payload.refreshToken,
      },
      {
        _id: true,
      },
    );
    const updateResult = await this.signedDeviceModel.model
      .updateOne(
        {
          _id: signedDevice._id,
        },
        {
          $set: {
            token: payload.deviceToken,
            platform: payload.devicePlatform,
          },
        },
      )
      .exec();
    if (!updateResult.modifiedCount) {
      throw new BadRequestException(
        HttpErrorMessages['Update failed. Please try again.'],
      );
    }
  }
}
