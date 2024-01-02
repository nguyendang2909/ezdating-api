import { IsNotEmpty, IsString } from 'class-validator';

import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';

export class FakeFindManyLearningProfilesQuery extends FindManyCursorQuery {
  @IsNotEmpty()
  @IsString()
  teachingSubject: string;
}
