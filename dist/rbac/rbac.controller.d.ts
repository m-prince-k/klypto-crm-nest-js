import { AssignRoleDto, CreateRoleDto } from './dto/rbac.dto';
import { RbacService } from './rbac.service';
export declare class RbacController {
    private readonly rbacService;
    constructor(rbacService: RbacService);
    createRole(dto: CreateRoleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isSystem: boolean;
    }>;
    listRoles(): Promise<{
        id: string;
        name: string;
        description: string | null;
        isSystem: boolean;
        assignedUsersCount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    assignRole(dto: AssignRoleDto, req: {
        user?: {
            sub?: string;
        };
    }): Promise<{
        message: string;
        assignment: {
            user: {
                id: string;
                email: string;
                fullName: string;
            };
            role: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isSystem: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            roleId: string;
            assignedById: string | null;
        };
    }>;
    getUserRoles(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
        };
        roles: {
            assignmentId: string;
            roleId: string;
            roleName: string;
            description: string | null;
            isSystem: boolean;
            assignedAt: Date;
            assignedBy: {
                id: string;
                email: string;
                fullName: string;
            } | null;
        }[];
    }>;
}
