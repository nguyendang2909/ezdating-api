import Joi from 'joi';

export type ReadChatMessageDto = {
  lastMessageId: string;
  matchId: string;
};

export const ReadChatMessageSchema = Joi.object({
  lastMessageId: Joi.string().required(),
  matchId: Joi.string().required(),
}).options({
  allowUnknown: true,
  stripUnknown: true,
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
