import { IsMongoId, IsNotEmpty } from 'class-validator';

import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';

export class FindManyMessagesQuery extends FindManyCursorQuery {
  @IsNotEmpty()
  @IsMongoId()
  matchId: string;
}
