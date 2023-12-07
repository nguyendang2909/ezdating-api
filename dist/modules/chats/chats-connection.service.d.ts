import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DbService } from '../../commons/services/db.service';
import { AccessTokensService } from '../../libs';
import { UserModel } from '../models/user.model';
export declare class ChatsConnectionService extends DbService {
    private readonly acessTokensService;
    private readonly userModel;
    constructor(acessTokensService: AccessTokensService, userModel: UserModel);
    logger: Logger;
    handleConnection(socket: Socket): Promise<void>;
}
