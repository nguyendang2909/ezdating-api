import { ClientData } from '../auth/auth.type';
import { UsersReadMeService } from './services';
export declare class UsersController {
    private readonly readMeService;
    constructor(readMeService: UsersReadMeService);
    findMe(client: ClientData): Promise<{
        type: string;
        data: import("../models").User;
    }>;
    deactivateInfo(): Promise<{
        type: string;
        data: string;
    }>;
}
