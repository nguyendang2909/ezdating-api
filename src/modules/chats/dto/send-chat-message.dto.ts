import Joi from 'joi';

export class SendChatMessageDto {
  targetUserId: string;
  text?: string;
}

export const SendChatMessageSchema = Joi.object({
  targetUserId: Joi.string().guid().optional(),
  text: Joi.string().guid().optional(),
}).options({
  allowUnknown: false,
  abortEarly: true,
});

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
