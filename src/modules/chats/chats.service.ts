import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { EncryptionsUtil } from '../encryptions/encryptions.util';
import { RoomEntity } from '../rooms/room-entity.service';
import { UsersAuthUtil } from '../users/auth-users.util';
import { EUserStatus } from '../users/users.constant';
import { UserEntity } from '../users/users-entity.service';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly encryptionsUtil: EncryptionsUtil,
    private readonly userEntity: UserEntity,
    private readonly usersAuthUtil: UsersAuthUtil,
    private readonly roomEntity: RoomEntity,
  ) {}

  private readonly logger = new Logger(ChatsService.name);

  public async sendMessage(payload: SendChatMessageDto, socket: Socket) {
    const { roomId, targetUserId, text } = payload;
    if (!text) {
      throw new WsException({
        errorCode: 'MESSAGE_CONTENT_NOT_FOUND',
        message: 'Message content not found',
      });
    }
    if (roomId) {
      return await this.sendMessageByRoomId(roomId, payload, socket);
    }
    return await this.sendMessageByTargetUserId(targetUserId, socket);
  }

  private async sendMessageByRoomId(
    roomId: string,
    payload: SendChatMessageDto,
    socket: Socket,
  ) {
    const currentUserId = this.getCurrentUserIdFromSocket(socket);
    const existRoom = await this.roomEntity.findOneByIdAndUserId(
      roomId,
      currentUserId,
      {
        select: {
          id: true,
        },
      },
    );
    if (!existRoom) {
      throw new WsException({
        errorCode: 'ROOM_NOT_FOUND',
        message: 'Room not found!',
      });
    }
    const { userIds } = existRoom;
    if (!userIds || userIds.length !== 2) {
      throw new WsException({ errorCode: 'USER_NOT_FOUND' });
    }
    // await this
    // await socket.emit(currentUserId, payload);
  }

  public async sendMessageByTargetUserId(
    targetUserId: string,
    socket: Socket,
  ) {}

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
    try {
      const { authorization } = socket.handshake.headers;
      const token = authorization?.split(' ')[1];
      if (token) {
        const decodedToken = this.encryptionsUtil.verifyJwt(token);
        const user = await this.userEntity.findOneById(decodedToken.id, {
          select: { id: true, status: true },
        });
        if (user && user.status !== EUserStatus.banned) {
          socket.handshake.user = user;
          socket.join(user.id);
          this.logger.log(`Socket connected: ${socket.id}`);
          return;
        }
      }

      throw new Error('Invalid credentials!');
    } catch (err) {
      throw new WsException({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
        message: 'Invalid credentials!',
      });
    }
  }

  private getCurrentUserIdFromSocket(socket: Socket) {
    return socket.handshake.user.id;
  }
}
