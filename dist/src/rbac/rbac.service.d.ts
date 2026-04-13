import { PrismaService } from '../prisma/prisma.service';
import { AssignRoleDto, CreateRoleDto } from './dto/rbac.dto';
export declare class RbacService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRole(dto: CreateRoleDto): Promise<any>;
    listRoles(): Promise<any>;
    assignRole(dto: AssignRoleDto, assignedById: string): Promise<{
        message: string;
        assignment: any;
    }>;
    getUserRoles(userId: string): Promise<{
        user: {
            id: any;
            email: any;
            fullName: any;
        };
        roles: any;
    }>;
}
