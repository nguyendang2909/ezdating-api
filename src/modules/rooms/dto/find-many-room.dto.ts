import { JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { DtoFactory } from '../../../commons/lib/dto-factory.lib';
import { FindAllRoomsDto } from './find-all-room.dto';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyRoomsDto extends DtoFactory.findManyByCursor(
  FindAllRoomsDto,
) {}
