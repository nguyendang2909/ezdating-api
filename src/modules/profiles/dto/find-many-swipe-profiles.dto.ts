import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';
import { GeolocationQuery } from './geolocation.query';

export class FindManySwipeProfilesQuery extends IntersectionType(
  FindManyCursorQuery,
  GeolocationQuery,
) {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  excludedUserId?: string[] | string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString({ each: false })
  stateId?: string;
}
