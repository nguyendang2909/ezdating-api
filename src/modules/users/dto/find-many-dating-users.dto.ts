import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';

export class FindManyDatingUsersQuery extends FindManyCursorQuery {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  excludedUserId?: string[] | string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsNumber()
  minDistance?: string;
}
