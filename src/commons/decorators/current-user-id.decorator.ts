import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export const Client = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<Request>();

    if (!user) {
      throw new BadRequestException('Access token payload does not exist!');
    }

    return user;
  },
);
