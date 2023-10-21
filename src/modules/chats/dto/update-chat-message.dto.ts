import { IsNotEmpty, IsString } from 'class-validator';
import Joi from 'joi';

export class UpdateChatMessageDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
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
