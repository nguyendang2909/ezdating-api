import { ClientData } from '../auth/auth.type';
import { UpdateProfileFilterDto } from './dto';
import { ProfileFiltersService } from './profile-filters.service';
export declare class ProfileFiltersController {
    private readonly service;
    constructor(service: ProfileFiltersService);
    update(payload: UpdateProfileFilterDto, client: ClientData): Promise<void>;
    getMe(client: ClientData): Promise<{
        type: string;
        data: import("../models").ProfileFilter;
    }>;
}
