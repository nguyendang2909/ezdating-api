import { ApiService } from '../../../commons/services/api.service';
import { MongoGeoLocation } from '../../models';
export declare class ProfileApiBaseService extends ApiService {
    getAndCheckValidBirthdayFromRaw(rawBirthday: string): Date;
    getGeolocationFromQueryParams(payload: {
        latitude: string;
        longitude: string;
    }): MongoGeoLocation;
}
