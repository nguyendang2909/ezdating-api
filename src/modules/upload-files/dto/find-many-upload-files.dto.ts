import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { FindManyCursorDto } from '../../../commons/dto/find-many-cursor.dto';
import { EUploadFileType } from '../upload-files.constant';

@JoiSchemaOptions({})
export class FindManyUploadFilesDto extends FindManyCursorDto {
  @JoiSchema(
    Joi.number()
      .valid(...Object.values(EUploadFileType))
      .required(),
  )
  type: EUploadFileType;
}
