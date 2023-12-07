import { FirebaseService } from '../../libs';
export declare class IosPushNotificationsService {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    send(deviceToken: string, message: {
        content: string;
        title: string;
    }): Promise<string>;
}
