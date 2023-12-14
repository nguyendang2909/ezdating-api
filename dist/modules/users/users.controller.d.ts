import { ClientData } from '../auth/auth.type';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findOneById(client: ClientData): Promise<{
        type: string;
        data: import("../models").User;
    }>;
    deactivateInfo(client: ClientData): Promise<{
        type: string;
        data: string;
    }>;
}
