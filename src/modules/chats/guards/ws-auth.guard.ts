import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import _ from 'lodash';
import { Socket } from 'socket.io';

import { UserStatuses } from '../../../commons/constants/enums';
import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { UserModel } from '../../entities/users.model';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly userModel: UserModel,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.query.token;
    if (!token || !_.isString(token)) {
      throw new WsException({ status: 401, message: 'Unauthorized' });
    }
    const decoded = this.encryptionsUtil.verifyAccessToken(token);
    const user = await this.userModel.findOneById(decoded.id);
    if (!user) {
      throw new WsException({
        status: 404,
        errorCode: 'USER_DOES_NOT_EXIST',
        message: 'User does not exist!',
      });
    }
    if (user.status === UserStatuses.banned) {
      throw new WsException({
        status: 403,
        errorCode: 'YOU_HAS_BEEN_BANNED',
        message: 'You have been banned!',
      });
    }

    client.handshake.user = user;

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return true;
  }
}
