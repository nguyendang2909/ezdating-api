import { BadRequestException, Injectable } from '@nestjs/common';
import moment from 'moment';

import { ResponseSuccess } from '../../commons/dto/response.dto';
import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
import { ClientData } from '../auth/auth.type';
import { UserModel } from '../models/user.model';
import { ViewModel } from '../models/view.model';
import { SendViewDto } from './dto/send-view.dto';

@Injectable()
export class ViewsService {
  constructor(
    private readonly viewModel: ViewModel,
    private readonly userModel: UserModel,
  ) {}

  public async send(
    payload: SendViewDto,
    clientData: ClientData,
  ): Promise<ResponseSuccess> {
    const currentUserId = clientData.id;
    const { targetUserId } = payload;

    if (currentUserId === targetUserId) {
      throw new BadRequestException({
        errorCode: HttpErrorCodes.CONFLICT_USER,
        message: 'You cannot view yourself!',
      });
    }

    const _currentUserId = this.userModel.getObjectId(currentUserId);
    const _targetUserId = this.userModel.getObjectId(targetUserId);

    const now = moment().toDate();

    await this.viewModel.model.create({
      _userId: _currentUserId,
      _targetUserId,
      viewedAt: now,
    });

    return { success: true };
  }
}