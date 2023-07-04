import { Logger, UseGuards, UsePipes } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatsService } from './chats.service';
import {
  SendChatMessageDto,
  SendChatMessageSchema,
} from './dto/send-chat-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { WsValidationPipe } from './guards/ws-validation.pipe';

@WebSocketGateway({
  namespace: '/chats',
  cors: true,
  origin: '*',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer() private readonly server!: Server;

  private readonly logger = new Logger(ChatsGateway.name);

  @SubscribeMessage('sendMsg')
  @UseGuards(WsAuthGuard)
  @UsePipes(new WsValidationPipe(SendChatMessageSchema))
  create(socket: Socket, payload: SendChatMessageDto) {
    return this.chatsService.sendMessage(payload, socket);
  }

  @SubscribeMessage('findAllChats')
  findAll() {
    return this.chatsService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatsService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatsService.remove(id);
  }

  public async handleConnection(socket: Socket) {
    return await this.chatsService.handleConnection(socket);
  }

  public async handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }

  public afterInit(server: any) {}
}
