import { IntersectionType } from '@nestjs/swagger';

import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';
import { GeolocationQuery } from './geolocation.query';

export class FindManyNearbyProfilesQuery extends IntersectionType(
  FindManyCursorQuery,
  GeolocationQuery,
) {}
