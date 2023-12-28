import { MongoGeoLocation } from '../modules/models';
import { BaseUtil } from './bases/base.util';
export declare class ProfilesUtil extends BaseUtil {
    verifyBirthdayFromRaw(rawBirthday: string): Date;
    getGeolocationFromQueryParams(payload: {
        latitude: string;
        longitude: string;
    }): MongoGeoLocation;
}
