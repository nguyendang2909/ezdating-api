import { JoiSchemaOptions } from 'nestjs-joi';

import { DEFAULT_VALIDATION_OPTIONS } from '../../../commons/dto/default-validation-options';
import { FindDto } from '../../../commons/dto/find.dto';

@JoiSchemaOptions(DEFAULT_VALIDATION_OPTIONS)
export class FindMyProfileDto extends FindDto {}
