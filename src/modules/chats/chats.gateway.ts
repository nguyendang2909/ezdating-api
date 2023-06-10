import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatsService } from './chats.service';
import { SendChatMessageDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@WebSocketGateway({
  namespace: '/chats',
  cors: true,
  origin: '*',
})
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer() private readonly server!: Server;

  private readonly logger = new Logger(ChatsGateway.name);

  @SubscribeMessage('sendMessage')
  create(@MessageBody() sendChatMessageDto: SendChatMessageDto) {
    return this.chatsService.sendMessage(sendChatMessageDto);
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

  private async handleConnection(socket: Socket) {
    return await this.chatsService.handleConnection(socket);
  }

  private async handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
