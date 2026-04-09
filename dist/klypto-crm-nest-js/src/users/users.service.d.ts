import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOneByEmail(email: string): Promise<({
        organization: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        roleAssignments: {
            id: string;
            createdAt: Date;
            userId: string;
            roleId: string;
            assignedById: string | null;
        }[];
    } & {
        id: string;
        email: string;
        passwordHash: string;
        hashedRefreshToken: string | null;
        fullName: string;
        isActive: boolean;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    findOneById(id: string): Promise<({
        organization: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
        roleAssignments: {
            id: string;
            createdAt: Date;
            userId: string;
            roleId: string;
            assignedById: string | null;
        }[];
    } & {
        id: string;
        email: string;
        passwordHash: string;
        hashedRefreshToken: string | null;
        fullName: string;
        isActive: boolean;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(data: Prisma.UserCreateInput): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        hashedRefreshToken: string | null;
        fullName: string;
        isActive: boolean;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
