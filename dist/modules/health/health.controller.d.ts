import { Request, Response } from 'express';
export declare class HealthController {
    private logger;
    private readonly GITHUB_WEBHOOK_SECRET_KEY;
    deployDevelop(res: Response, req: Request): Response<any, Record<string, any>> | undefined;
    checkHealth(): {
        health: string;
    };
}
