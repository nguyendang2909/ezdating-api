import Redis from 'ioredis';
import Redlock from 'redlock';
export declare class CacheService {
    readonly redis: Redis;
    private readonly redlock;
    private readonly logger;
    constructor(redis: Redis, redlock: Redlock);
    setex(key: string, ttl: number, value: Record<string, any>): Promise<"OK">;
    ttl(key: string): Promise<number>;
    getJSON<T>(key: string): Promise<T | null>;
    lock(key: string, duration?: number): Promise<import("redlock").Lock>;
}
