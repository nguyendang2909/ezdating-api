import { Logger, UseGuards } from '@nestjs/common';
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

import { Constants } from '../../commons/constants/constants';
import { ChatsService } from './chats.service';
import { ChatsConnectionService } from './chats-connection.service ';
import {
  SendChatMessageDto,
  SendChatMessageSchema,
} from './dto/send-chat-message.dto';
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

  @SubscribeMessage(Constants.socketEvents.toServer.sendMessage)
  @UseGuards(WsAuthGuard)
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

  @SubscribeMessage(Constants.socketEvents.toServer.editMessage)
  @UseGuards(WsAuthGuard)
  public async editMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: UpdateChatMessageDto,
  ) {
    const { error } = SendChatMessageSchema.validate(payload);
    if (error) {
      this.logger.error(`Socket validation failed ${error}`);
      throw new WsException('Validation failed');
    }
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
