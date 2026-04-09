import { AuthServiceService } from './auth-service.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AuthServiceController {
    private readonly authServiceService;
    private readonly prisma;
    constructor(authServiceService: AuthServiceService, prisma: PrismaService);
    getHello(): string;
    countUsers(): Promise<{
        count: number;
    }>;
}
