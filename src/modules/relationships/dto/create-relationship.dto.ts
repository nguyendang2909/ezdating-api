import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import {
  RelationshipUserStatus,
  RelationshipUserStatusObj,
} from '../relationships.constant';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class SendRelationshipStatusDto {
  @JoiSchema(Joi.string().guid().required())
  targetUserId: string;

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(RelationshipUserStatusObj))
      .required(),
  )
  status: RelationshipUserStatus;
}
