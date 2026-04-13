import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { Request } from 'express';
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
    me(req: Request & {
        user?: {
            sub?: string;
        };
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        organization: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        roles: string[];
        isActive: boolean;
        createdAt: Date;
    }>;
}
