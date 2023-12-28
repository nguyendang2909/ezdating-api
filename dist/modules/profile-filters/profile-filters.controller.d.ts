import { ClientData } from '../auth/auth.type';
import { UpdateProfileFilterDto } from './dto';
import { ProfileFiltersReadMeService } from './services/profile-filters-read-me.service';
import { ProfileFiltersWriteMeService } from './services/profile-filters-write-me.service';
export declare class ProfileFiltersController {
    private readonly readMeService;
    private readonly writeMeService;
    constructor(readMeService: ProfileFiltersReadMeService, writeMeService: ProfileFiltersWriteMeService);
    update(payload: UpdateProfileFilterDto, client: ClientData): Promise<void>;
    getMe(client: ClientData): Promise<{
        type: string;
        data: import("../models").ProfileFilter;
    }>;
}
