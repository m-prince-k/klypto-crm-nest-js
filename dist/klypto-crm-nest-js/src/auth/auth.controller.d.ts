import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        role?: string | undefined;
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        roles: string[];
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    refresh(req: any): Promise<{
        roles: string[];
        accessToken: string;
        refreshToken: string;
    }>;
}
