import { FirebaseService } from '../../libs';
export declare class AndroidPushNotificationsService {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    send(deviceToken: string, message: {
        content: string;
        title: string;
    }): Promise<string>;
}
