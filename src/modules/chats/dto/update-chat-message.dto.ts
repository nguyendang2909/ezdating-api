import Joi from 'joi';

export class UpdateChatMessageDto {
  id: string;
  text?: string;
}

export const UpdateChatMessageSchema = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().optional(),
}).options({
  allowUnknown: true,
  stripUnknown: true,
  abortEarly: true,
});
