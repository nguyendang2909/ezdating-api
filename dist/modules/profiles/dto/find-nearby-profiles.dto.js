"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindManyNearbyProfilesQuery = void 0;
const swagger_1 = require("@nestjs/swagger");
const find_many_cursor_dto_1 = require("../../../commons/dto/find-many-cursor.dto");
const geolocation_query_1 = require("./geolocation.query");
class FindManyNearbyProfilesQuery extends (0, swagger_1.IntersectionType)(find_many_cursor_dto_1.FindManyCursorQuery, geolocation_query_1.GeolocationQuery) {
}
exports.FindManyNearbyProfilesQuery = FindManyNearbyProfilesQuery;
//# sourceMappingURL=find-nearby-profiles.dto.js.map