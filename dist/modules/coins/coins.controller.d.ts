import { ClientData } from '../auth/auth.type';
import { CoinsService } from './coins.service';
export declare class CoinsController {
    private readonly coinsService;
    constructor(coinsService: CoinsService);
    findManyAttendances(clientData: ClientData): Promise<{
        isReceivedAttendance: boolean;
        data: import("../models").CoinAttendance[];
        type: string;
    }>;
}
