import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
export declare class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly chatsService;
    private readonly chatsConnectionService;
    constructor(chatsService: ChatsService, chatsConnectionService: ChatsConnectionService);
    readonly server: Server;
    private readonly logger;
    sendMsg(socket: Socket, payload: SendChatMessageDto): Promise<void>;
    editMessage(socket: Socket, payload: UpdateChatMessageDto): Promise<void>;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    afterInit(): void;
}
