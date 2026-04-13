import { AssignRoleDto, CreateRoleDto } from './dto/rbac.dto';
import { RbacService } from './rbac.service';
export declare class RbacController {
    private readonly rbacService;
    constructor(rbacService: RbacService);
    createRole(dto: CreateRoleDto): Promise<any>;
    listRoles(): Promise<any>;
    assignRole(dto: AssignRoleDto, req: {
        user?: {
            sub?: string;
        };
    }): Promise<{
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
