import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { UsersAuthUtil } from '../users/auth-users.util';
import { EUserStatus } from '../users/users.constant';
import { UsersUtil } from '../users/users.util';
import { SendChatMessageDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly usersUtil: UsersUtil,
    private readonly usersAuthUtil: UsersAuthUtil,
  ) {}

  private readonly logger = new Logger(ChatsService.name);

  sendMessage(sendChatMessageDto: SendChatMessageDto) {
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  public async handleConnection(socket: Socket) {
    console.log(socket.handshake);
    const { authorization } = socket.handshake.headers;
    const token = authorization?.split(' ')[1];
    console.log(token);
    if (token) {
      const decodedToken = this.encryptionsUtil.verifyJwt(token);
      const user = await this.usersAuthUtil.findOneById(decodedToken.id);
      if (user && user.status !== EUserStatus.banned) {
        socket.handshake.user = user;
        socket.join(user.id);
        this.logger.log(`Socket connected: ${socket.id}`);
        return;
      }
    }

    // throw new WsException('Unauthorized');

    socket.disconnect();
  }
}
