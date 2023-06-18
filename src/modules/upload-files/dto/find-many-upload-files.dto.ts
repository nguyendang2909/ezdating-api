import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { FindManyCursorDto } from '../../../commons/dto/find-many-cursor.dto';
import { EUploadFileShare, EUploadFileType } from '../upload-files.constant';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyUploadFilesDto extends FindManyCursorDto {
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(EUploadFileShare))
      .required(),
  )
  share!: EUploadFileShare;

  @JoiSchema(Joi.string().guid().optional())
  targetUserId: string;

  @JoiSchema(
    Joi.number()
      .valid(...Object.values(EUploadFileType))
      .required(),
  )
  type!: EUploadFileType;
}
