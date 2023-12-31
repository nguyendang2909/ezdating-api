import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { APP_CONFIG } from '../../app.config';
import { ClientData } from '../auth/auth.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt']) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      APP_CONFIG.PUBLIC_ENDPOINT_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest<T extends ClientData>(
    err: unknown,
    user: T,
    info: unknown,
    context: ExecutionContext,
  ) {
    if (user) {
      return user;
    }

    throw err || new UnauthorizedException();
  }
}
