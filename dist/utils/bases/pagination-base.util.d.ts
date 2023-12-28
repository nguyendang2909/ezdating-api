import { Pagination } from '../../types';
export declare class PaginationBaseUtil {
    getCursor(_cursor: string): any;
    decode(e: string): string;
    encodeCursor(e: string): string;
    getPaginationByField<T>(data: T[], field: keyof T | (keyof T)[], limitRecordsPerQuery: number): Pagination;
    encodeFromString(value: string): string;
    encodeFromObj(value: Record<string, any>): string;
}
