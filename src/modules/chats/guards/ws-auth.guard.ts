import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import _ from 'lodash';
import { Socket } from 'socket.io';

import { EncryptionsUtil } from '../../encryptions/encryptions.util';
import { UserEntity } from '../../users/users-entity.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly userEntity: UserEntity,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const authHeaders =
      client.handshake.headers.authorization ||
      client.handshake.headers.Authorization;
    if (!authHeaders || !_.isString(authHeaders)) {
      throw new WsException({ status: 401, message: 'Unauthorized' });
    }
    const token = authHeaders.split(' ')[1];
    if (!token) {
      throw new WsException({ status: 401, message: 'Unauthorized' });
    }
    const decoded = this.encryptionsUtil.verifyJwt(token);
    const user = await this.userEntity.findOneById(decoded.id, {
      select: {
        id: true,
        status: true,
      },
    });
    if (!user) {
      throw new WsException({
        status: 404,
        type: 'user',
        message: 'User not found',
      });
    }

    client.handshake.user = user;

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return true;
  }
}
