import { FindManyCursorQuery } from '../../../commons/dto/find-many-cursor.dto';
import { GeolocationQuery } from './geolocation.query';
declare const FindManySwipeProfilesQuery_base: import("@nestjs/common").Type<FindManyCursorQuery & GeolocationQuery>;
export declare class FindManySwipeProfilesQuery extends FindManySwipeProfilesQuery_base {
    excludedUserId?: string[] | string;
    stateId?: string;
}
export {};
