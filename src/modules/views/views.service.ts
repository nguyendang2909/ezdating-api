import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { ResponseSuccess } from '../../commons/dto/response.dto';
import { HttpErrorMessages } from '../../commons/erros/http-error-messages.constant';
import { ApiService } from '../../commons/services/api.service';
import { ClientData } from '../auth/auth.type';
import { UserModel } from '../models/user.model';
import { ViewModel } from '../models/view.model';
import { SendViewDto } from './dto/send-view.dto';

@Injectable()
export class ViewsService extends ApiService {
  constructor(
    private readonly viewModel: ViewModel,
    private readonly userModel: UserModel,
  ) {
    super();
  }

  public async send(
    payload: SendViewDto,
    clientData: ClientData,
  ): Promise<ResponseSuccess> {
    const currentUserId = clientData.id;
    const { targetUserId } = payload;

    if (currentUserId === targetUserId) {
      throw new BadRequestException({
        message: HttpErrorMessages['You cannot view yourself!'],
      });
    }

    const _currentUserId = this.getObjectId(currentUserId);
    const _targetUserId = this.getObjectId(targetUserId);

    const existView = await this.viewModel.model.findOne({
      _userId: _currentUserId,
      _targetUserId,
    });

    if (existView) {
      return { success: true };
    }

    const now = moment().toDate();

    await this.viewModel.model.create({
      _targetUserId,
      _userId: _currentUserId,
      viewedAt: now,
    });

    return { success: true };
  }
}
