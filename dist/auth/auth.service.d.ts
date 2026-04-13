import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly prisma;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService);
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
    logout(userId: string): Promise<{
        message: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        roles: string[];
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(userId?: string): Promise<{
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
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    getTokens(userId: string, email: string, roles: string[]): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private ensureSuperAdminRole;
    private assignRoleToUser;
}
