import { app } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
export declare class FirebaseService {
    readonly firebase: app.App;
    constructor(firebase: app.App);
    decodeToken(token: string): Promise<DecodedIdToken>;
}
