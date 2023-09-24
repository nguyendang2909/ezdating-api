import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import {
  MediaFileType,
  MediaFileTypes,
} from '../../../commons/constants';
import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyUploadFilesDto {
  @JoiSchema(Joi.string().guid().optional())
  targetUserId: string;

  @JoiSchema(
    Joi.number()
      .valid(...Object.values(MediaFileTypes))
      .optional(),
  )
  type?: MediaFileType;
}
