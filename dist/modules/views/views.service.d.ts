import { ApiCursorDateService } from '../../commons';
import { Pagination } from '../../types';
import { ClientData } from '../auth/auth.type';
import { MatchModel, ProfileModel, View } from '../models';
import { ViewModel } from '../models/view.model';
import { FindManyViewsQuery } from './dto';
import { SendViewDto } from './dto/send-view.dto';
export declare class ViewsService extends ApiCursorDateService {
    private readonly viewModel;
    private readonly profileModel;
    private readonly matchModel;
    constructor(viewModel: ViewModel, profileModel: ProfileModel, matchModel: MatchModel);
    send(payload: SendViewDto, clientData: ClientData): Promise<View>;
    findMany(queryParams: FindManyViewsQuery, client: ClientData): Promise<View[]>;
    verifyNotSameUserById(userOne: string, userTwo: string): void;
    getPagination(data: View[]): Pagination;
}
