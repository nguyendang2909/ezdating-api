import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';
import { GeolocationQuery } from './geolocation.query';
declare const FindManyNearbyProfilesQuery_base: import("@nestjs/common").Type<FindManyCursorQuery & GeolocationQuery>;
export declare class FindManyNearbyProfilesQuery extends FindManyNearbyProfilesQuery_base {
}
export {};
