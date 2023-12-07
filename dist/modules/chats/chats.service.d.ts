/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { DbService } from '../../commons/services/db.service';
import { MatchModel } from '../models/match.model';
import { MessageModel } from '../models/message.model';
import { SignedDeviceModel } from '../models/signed-device.model';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { ChatsHandler } from './chats.handler';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
export declare class ChatsService extends DbService {
    private readonly matchModel;
    private readonly messageModel;
    private readonly signedDeviceModel;
    private readonly pushNotificationsService;
    private chatsHandler;
    constructor(matchModel: MatchModel, messageModel: MessageModel, signedDeviceModel: SignedDeviceModel, pushNotificationsService: PushNotificationsService, chatsHandler: ChatsHandler);
    logger: Logger;
    sendMessage(payload: SendChatMessageDto, socket: Socket): Promise<void>;
    editMessage(payload: UpdateChatMessageDto, socket: Socket): Promise<void>;
    createMessage({ payload, _currentUserId, _matchId, }: {
        _currentUserId: Types.ObjectId;
        _matchId: Types.ObjectId;
        payload: SendChatMessageDto;
    }): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../models").Message> & import("../models").Message & Required<{
        _id: Types.ObjectId;
    }>>>;
}
