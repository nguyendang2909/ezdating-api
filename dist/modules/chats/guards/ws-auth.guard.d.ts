import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokensService } from '../../../libs';
export declare class WsAuthGuard implements CanActivate {
    private readonly reflector;
    private readonly accessTokensService;
    constructor(reflector: Reflector, accessTokensService: AccessTokensService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
