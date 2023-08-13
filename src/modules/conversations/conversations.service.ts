// import { Injectable, NotFoundException } from '@nestjs/common';
// import _ from 'lodash';
// import { And, IsNull, LessThan, MoreThan, Not } from 'typeorm';

// import { RelationshipUserStatuses } from '../../commons/constants/constants';
// import { Cursors } from '../../commons/constants/paginations';
// import { HttpErrorCodes } from '../../commons/erros/http-error-codes.constant';
// import { EntityFactory } from '../../commons/lib/entity-factory';
// import { ClientData } from '../auth/auth.type';
// import { MessageModel } from '../entities/message.model';
// import { RelationshipModel } from '../entities/relationship-entity.model';
// import { UserModel } from '../entities/user.model';
// import { FindManyMessagesByConversationIdDto } from '../messages/dto/find-many-messages.dto';
// import { FindManyConversations } from './dto/find-many-conversations.dto';

// @Injectable()
// export class ConversationsService {
//   constructor(
//     private readonly relationshipModel: RelationshipModel,
//     private readonly userModel: UserModel,
//     private readonly messageModel: MessageModel,
//   ) {}

//   public async findMany(
//     queryParams: FindManyConversations,
//     clientData: ClientData,
//   ) {
//     const findResult = await this.findManyByQuery(queryParams, clientData);

//     const conversations = this.relationshipModel.formatConversations(
//       findResult,
//       clientData.id,
//     );

//     return {
//       type: 'conversations',
//       data: conversations,
//       pagination: {
//         cursors: EntityFactory.getCursors({
//           before: _.last(conversations)?.lastMessageAt,
//           after: _.first(conversations)?.lastMessageAt,
//         }),
//       },
//     };
//   }

//   public async findOneOrFailById(id: string, clientData: ClientData) {
//     const currentUserObj = {
//       id: clientData.id,
//     };
//     const lastMessageQuery = { lastMessage: Not(IsNull()) };
//     const findResult = await this.relationshipModel.findOne({
//       where: [
//         {
//           ...lastMessageQuery,
//           userOneStatus: And(
//             Not(RelationshipUserStatuses.block),
//             Not(RelationshipUserStatuses.cancel),
//           ),
//           userTwoStatus: And(
//             Not(RelationshipUserStatuses.block),
//             Not(RelationshipUserStatuses.cancel),
//           ),
//           userOne: currentUserObj,
//         },
//         {
//           ...lastMessageQuery,
//           userOneStatus: And(
//             Not(RelationshipUserStatuses.block),
//             Not(RelationshipUserStatuses.cancel),
//           ),
//           userTwoStatus: And(
//             Not(RelationshipUserStatuses.block),
//             Not(RelationshipUserStatuses.cancel),
//           ),
//           userTwo: currentUserObj,
//         },
//       ],
//       order: {
//         lastMessageAt: 'DESC',
//       },
//       relations: [
//         'userOne',
//         'userOne.avatarFile',
//         'userTwo',
//         'userTwo.avatarFile',
//       ],
//       select: {
//         userOne: {
//           id: true,
//           birthday: true,
//           gender: true,
//           introduce: true,
//           lastActivatedAt: true,
//           lookingFor: true,
//           nickname: true,
//           role: true,
//           status: true,
//           avatarFile: {
//             location: true,
//           },
//         },
//         userTwo: {
//           id: true,
//           birthday: true,
//           gender: true,
//           introduce: true,
//           lastActivatedAt: true,
//           lookingFor: true,
//           nickname: true,
//           role: true,
//           status: true,
//           avatarFile: {
//             location: true,
//           },
//         },
//       },
//     });

//     if (!findResult) {
//       throw new NotFoundException({
//         errorCode: HttpErrorCodes.CONVERSATION_DOES_NOT_EXIST,
//         message: 'Conversation does not exist!',
//       });
//     }

//     const conversation = this.relationshipModel.formatConversation(
//       findResult,
//       clientData.id,
//     );

//     return {
//       type: 'conversations',
//       data: conversation,
//     };
//   }

//   public async findManyMessagesByConversationId(
//     id: string,
//     queryParams: FindManyMessagesByConversationIdDto,
//     clientData: ClientData,
//   ) {
//     await this.findOneOrFailById(id, clientData);

//     const { cursor } = queryParams;

//     const extractCursor = EntityFactory.extractCursor(cursor);

//     const lastCreatedAt = extractCursor
//       ? new Date(extractCursor.value)
//       : undefined;

//     const findResult = await this.messageModel.findMany({
//       where: {
//         relationship: { id },
//         ...(lastCreatedAt
//           ? {
//               createdAt:
//                 extractCursor?.type === Cursors.after
//                   ? LessThan(lastCreatedAt)
//                   : MoreThan(lastCreatedAt),
//             }
//           : {}),
//       },
//       order: {
//         createdAt: 'DESC',
//       },
//       relations: ['user', 'user.avatarFile'],
//       select: {
//         user: {
//           id: true,
//           nickname: true,
//           avatarFile: {
//             location: true,
//           },
//         },
//       },
//       take: 20,
//     });

//     const messages = this.messageModel.formats(findResult);

//     return {
//       type: 'messagesByConversation',
//       conversationId: id,
//       data: messages,
//       pagination: {
//         cursors: EntityFactory.getCursors({
//           before: _.last(messages)?.createdAt,
//           after: _.first(messages)?.createdAt,
//         }),
//       },
//     };
//   }

//   public async findManyByQuery(
//     queryParams: FindManyConversations,
//     clientData: ClientData,
//   ) {
//     const { cursor } = queryParams;

//     const extractCursor = EntityFactory.extractCursor(cursor);

//     const lastMessageAt = extractCursor
//       ? new Date(extractCursor.value)
//       : undefined;
//     const lastMessageAtQuery = lastMessageAt
//       ? {
//           lastMessageAt:
//             extractCursor?.type === Cursors.before
//               ? MoreThan(lastMessageAt)
//               : LessThan(lastMessageAt),
//         }
//       : { lastMessageAt: Not(IsNull()) };
//     return await this.relationshipModel.findMany({
//       where: [
//         {
//           ...lastMessageAtQuery,
//           userOneStatus: And(
//             Not(RelationshipUserStatuses.block),
//             Not(RelationshipUserStatuses.cancel),
//           ),
//           userTwoStatus: And(
//             Not(RelationshipUserStatuses.block),
//             Not(RelationshipUserStatuses.cancel),
//           ),
//           userOne: {
//             id: clientData.id,
//           },
//         },
//         {
//           ...lastMessageAtQuery,
//           userOneStatus: And(
//             Not(RelationshipUserStatuses.block),
//             Not(RelationshipUserStatuses.cancel),
//           ),
//           userTwoStatus: And(
//             Not(RelationshipUserStatuses.block),
//             Not(RelationshipUserStatuses.cancel),
//           ),
//           userTwo: {
//             id: clientData.id,
//           },
//         },
//       ],
//       order: {
//         lastMessageAt: 'DESC',
//       },
//       relations: [
//         'userOne',
//         'userOne.uploadFiles',
//         'userOne.avatarFile',
//         'userTwo',
//         'userTwo.uploadFiles',
//         'userTwo.avatarFile',
//       ],
//       select: {
//         userOne: {
//           id: true,
//           birthday: true,
//           gender: true,
//           introduce: true,
//           lastActivatedAt: true,
//           lookingFor: true,
//           nickname: true,
//           role: true,
//           status: true,
//           avatarFile: {
//             location: true,
//           },
//           uploadFiles: {
//             location: true,
//           },
//         },
//         userTwo: {
//           id: true,
//           birthday: true,
//           gender: true,
//           introduce: true,
//           lastActivatedAt: true,
//           lookingFor: true,
//           nickname: true,
//           role: true,
//           status: true,
//           avatarFile: {
//             location: true,
//           },
//           uploadFiles: {
//             location: true,
//           },
//         },
//       },
//     });
//   }
// }
