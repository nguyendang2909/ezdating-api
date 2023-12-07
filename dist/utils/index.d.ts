export * from './validators';
export declare const delay: (time?: number) => Promise<void>;
export declare function retry<T>(promiseFn: () => Promise<T>, maxTries?: number): Promise<T>;
