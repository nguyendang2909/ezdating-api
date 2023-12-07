import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SOCKET_TO_SERVER_EVENTS } from '../../constants';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { WsAuthGuard } from './guards/ws-auth.guard';

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

  @WebSocketServer() public readonly server: Server;

  private readonly logger = new Logger(ChatsGateway.name);

  @SubscribeMessage(SOCKET_TO_SERVER_EVENTS.SEND_MESSAGE)
  @UseGuards(WsAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  public async sendMsg(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: SendChatMessageDto,
  ) {
    return await this.chatsService.sendMessage(payload, socket);
  }

  @SubscribeMessage(SOCKET_TO_SERVER_EVENTS.EDIT_MESSAGE)
  @UseGuards(WsAuthGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  public async editMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: UpdateChatMessageDto,
  ) {
    return await this.chatsService.editMessage(payload, socket);
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
