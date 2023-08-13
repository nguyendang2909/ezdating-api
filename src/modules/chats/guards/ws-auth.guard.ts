import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import _ from 'lodash';
import { Socket } from 'socket.io';

import { EncryptionsUtil } from '../../encryptions/encryptions.util';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly encryptionsUtil: EncryptionsUtil,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.query.token;
    if (!token || !_.isString(token)) {
      throw new WsException({ status: 401, message: 'Unauthorized' });
    }
    const decoded = this.encryptionsUtil.verifyAccessToken(token);

    client.handshake.user = decoded;

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return true;
  }
}
