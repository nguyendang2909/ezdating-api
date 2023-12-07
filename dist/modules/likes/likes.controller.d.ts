import { PaginatedResponse } from '../../types';
import { ClientData } from '../auth/auth.type';
import { View } from '../models';
import { FindManyLikedMeDto } from './dto/find-user-like-me.dto';
import { SendLikeDto } from './dto/send-like.dto';
import { LikesService } from './likes.service';
export declare class LikesController {
    private readonly service;
    constructor(service: LikesService);
    send(payload: SendLikeDto, clientData: ClientData): Promise<{
        type: string;
        data: View;
    }>;
    findManyLikedMe(queryParams: FindManyLikedMeDto, clientData: ClientData): Promise<PaginatedResponse<View>>;
    findOneLikeMeById(id: string, client: ClientData): Promise<{
        type: string;
        data: View;
    }>;
}
