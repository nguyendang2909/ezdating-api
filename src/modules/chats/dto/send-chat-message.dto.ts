import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SendChatMessageDto {
  @IsNotEmpty()
  @IsMongoId()
  matchId: string;

  @IsString()
  text: string;

  @IsString()
  uuid: string;
}

// export class SendChatMessageDto {
//   matchId: string;
//   text?: string;
//   uuid: string;
// }

// export const SendChatMessageSchema = Joi.object({
//   matchId: Joi.string().required(),
//   text: Joi.string().optional(),
//   uuid: Joi.string().guid().required(),
// }).options({
//   allowUnknown: false,
//   abortEarly: true,
// });

// export const SendChatMessageSchema = Joi.object({
//   roomId: Joi.string().guid().when('targetUserId', {
//     not: Joi.exist(),
//     then: Joi.required(),
//     otherwise: Joi.forbidden(),
//   }),
//   targetUserId: Joi.string().guid().optional(),
//   text: Joi.string().guid().optional(),
// }).options({
//   allowUnknown: false,
//   abortEarly: true,
// });
