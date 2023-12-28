import { PaginatedResponse } from '../../types';
import { ClientData } from '../auth/auth.type';
import { View } from '../models';
import { FindManyLikedMeQuery } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';
import { LikedMeReadService } from './services/liked-me-read-service';
import { LikesWriteService } from './services/likes-write.service';
export declare class LikesController {
    private readonly likedMeReadService;
    private readonly writeService;
    constructor(likedMeReadService: LikedMeReadService, writeService: LikesWriteService);
    send(payload: SendLikeDto, clientData: ClientData): Promise<{
        type: string;
        data: View;
    }>;
    findManyLikedMe(queryParams: FindManyLikedMeQuery, clientData: ClientData): Promise<PaginatedResponse<View>>;
    findOneLikeMeById(id: string, client: ClientData): Promise<{
        type: string;
        data: View;
    }>;
}
