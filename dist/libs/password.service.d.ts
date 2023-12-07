export declare class PasswordsService {
    SECRET_KEY: string;
    hash(key: string): string;
    compare(key: string, hashedKey: string): boolean;
    verifyCompare(password: string, hashedPassword: string): boolean;
}
