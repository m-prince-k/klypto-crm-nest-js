import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<void>;
    refresh(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
