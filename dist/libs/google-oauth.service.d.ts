import { OAuth2Client } from 'google-auth-library';
export declare class GoogleOAuthService {
    readonly oauthClient: OAuth2Client;
    constructor(oauthClient: OAuth2Client);
    private readonly logger;
}
