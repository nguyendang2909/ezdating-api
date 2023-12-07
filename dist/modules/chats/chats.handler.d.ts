import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DbService } from '../../commons/services/db.service';
import { Match, MessageDocument } from '../models';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { SignedDeviceModel } from '../models/signed-device.model';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
export declare class ChatsHandler extends DbService {
    private readonly matchModel;
    private readonly messageModel;
    private readonly signedDeviceModel;
    private readonly pushNotificationsService;
    constructor(matchModel: MatchModel, messageModel: MessageModel, signedDeviceModel: SignedDeviceModel, pushNotificationsService: PushNotificationsService);
    logger: Logger;
    handleAfterSendMessage({ match, message, socket, currentUserId, }: {
        currentUserId: string;
        match: Match;
        message: MessageDocument;
        socket: Socket;
    }): Promise<void>;
}
