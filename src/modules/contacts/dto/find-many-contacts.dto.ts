import { JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { DtoFactory } from '../../../commons/lib/dto-factory.lib';
import { FindAllContactsDto } from './find-all-contacts.dto';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyContactsDto extends DtoFactory.findManyByCursor(
  FindAllContactsDto,
) {}
