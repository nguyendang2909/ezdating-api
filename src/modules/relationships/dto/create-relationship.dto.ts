import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import {
  RelationshipUserStatus,
  RelationshipUserStatuses,
} from '../relationships.constant';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class SendRelationshipStatusDto {
  @JoiSchema(Joi.string().guid().required())
  targetUserId!: string;

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(RelationshipUserStatuses))
      .required(),
  )
  status!: RelationshipUserStatus;
}
