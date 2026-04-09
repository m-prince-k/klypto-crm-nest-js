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
    me(req: any): Promise<{
        id: string;
        email: string;
        fullName: string;
        organization: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        roles: any[];
        isActive: boolean;
        createdAt: Date;
    }>;
    logout(req: any): Promise<void>;
    refresh(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
