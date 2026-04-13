import { AdminApiService } from './admin-api.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AdminApiController {
    private readonly adminApiService;
    private readonly prisma;
    constructor(adminApiService: AdminApiService, prisma: PrismaService);
    getHello(): string;
    countAdmins(): Promise<{
        count: any;
    }>;
}
