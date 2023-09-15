import { JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindManyMatchesQuery extends FindManyCursorQuery {}
