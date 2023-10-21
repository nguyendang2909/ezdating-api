import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';

export class FindManyDatingUsersQuery extends FindManyCursorQuery {
  @ApiPropertyOptional({ type: [String] })
  @IsString({ each: true })
  excludedUserId?: string[] | string;

  @ApiPropertyOptional({ type: String })
  @IsNumber()
  minDistance?: string;
}
