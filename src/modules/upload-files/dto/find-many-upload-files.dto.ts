import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import {
  UploadFileType,
  UploadFileTypes,
} from '../../../commons/constants/constants';
import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { FindManyCursorDto } from '../../../commons/dto/find-many-cursor.dto';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyUploadFilesDto extends FindManyCursorDto {
  @JoiSchema(Joi.string().guid().optional())
  targetUserId: string;

  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UploadFileTypes))
      .required(),
  )
  type!: UploadFileType;
}
