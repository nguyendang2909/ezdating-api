// import Joi from 'joi';
// import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

// import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

// @JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
// export class SendRelationshipStatusDto {
//   @JoiSchema(Joi.string().required())
//   targetUserId!: string;

//   @JoiSchema(
//     Joi.number()
//       .valid(...Object.values(RelationshipUserStatuses))
//       .required(),
//   )
//   status!: RelationshipUserStatus;
// }
