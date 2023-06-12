import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({})
export class SendLikeRelationshipDto {
  @JoiSchema(Joi.string().guid().required())
  targetUserId: string;
}
