import { ClientData } from '../../modules/auth/auth.type';
import { Pagination } from '../../types';
import { DbService } from './db.service';
export declare class ApiService extends DbService {
    findMany(queryParams: Record<string, any>, client: ClientData): Promise<Record<string, any>[]>;
    findOneOrFailById(id: string, client: ClientData): Promise<Record<string, any>>;
    getPagination(data: unknown[]): Pagination;
    getPaginationByField<T>(data: T[], field: keyof T | (keyof T)[]): Pagination;
    encodeFromString(value: string): string;
    encodeFromObj(value: Record<string, any>): string;
    decodeToString(value: string): string;
    decodeToObj<T extends Record<string, any>>(value: string): T;
    protected getCursor(_cursor: string): any;
}
