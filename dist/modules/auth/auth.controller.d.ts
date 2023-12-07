import { AuthService } from './auth.service';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    logout(payload: LogoutDto): Promise<{
        type: string;
        success: void;
    }>;
    refreshAccessToken(payload: RefreshTokenDto): Promise<{
        type: string;
        data: {
            accessToken: string;
        };
    }>;
    refreshToken(payload: RefreshTokenDto): Promise<{
        type: string;
        data: {
            refreshToken: string;
        };
    }>;
}
