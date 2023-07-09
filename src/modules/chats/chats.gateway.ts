import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service ';
import {
  SendChatMessageDto,
  SendChatMessageSchema,
} from './dto/send-chat-message.dto';

@WebSocketGateway({
  namespace: '/chats',
  cors: true,
  origin: '*',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly chatsConnectionService: ChatsConnectionService,
  ) {}

  @WebSocketServer() private readonly server!: Server;

  private readonly logger = new Logger(ChatsGateway.name);

  @SubscribeMessage('sendMsg')
  // @UseGuards(WsAuthGuard)
  public async sendMsg(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: SendChatMessageDto,
  ) {
    const { error } = SendChatMessageSchema.validate(payload);
    if (error) {
      this.logger.error(`Socket validation failed ${error}`);
      throw new WsException('Validation failed');
    }
    return await this.chatsService.sendMessage(payload, socket);
  }

  public async handleConnection(socket: Socket) {
    return await this.chatsConnectionService.handleConnection(socket);
  }

  public async handleDisconnect(socket: Socket) {
    socket.disconnect();
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  public afterInit() {
    this.logger.log('Socket initialized');
  }
}
