import Joi from 'joi';
export declare class UpdateChatMessageDto {
    id: string;
    text?: string;
}
export declare const UpdateChatMessageSchema: Joi.ObjectSchema<any>;
