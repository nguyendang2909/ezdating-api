import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';
import { GeolocationQuery } from './geolocation.query';

export class FindManyDatingProfilesQuery extends IntersectionType(
  FindManyCursorQuery,
  GeolocationQuery,
) {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  excludedUserId?: string[] | string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsNumber()
  minDistance?: string;
}
