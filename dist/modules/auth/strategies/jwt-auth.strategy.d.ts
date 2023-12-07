import { Strategy } from 'passport-jwt';
import { ProfileModel } from '../../models';
import { ClientData } from '../auth.type';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private profileModel;
    constructor(profileModel: ProfileModel);
    validate(accessTokenPayload: ClientData): ClientData;
}
export {};
