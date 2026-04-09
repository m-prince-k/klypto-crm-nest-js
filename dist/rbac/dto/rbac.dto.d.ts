export declare class CreateRoleDto {
    name: string;
    description?: string;
}
export declare class AssignRoleDto {
    userId: string;
    roleName: string;
}
export declare class RoleResponseDto {
    id: string;
    name: string;
    description: string | null;
    isSystem: boolean;
    assignedUsersCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class RoleAssignmentUserDto {
    id: string;
    email: string;
    fullName: string;
}
export declare class RoleAssignmentRoleDto {
    id: string;
    name: string;
    description: string | null;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class RoleAssignmentDto {
    id: string;
    userId: string;
    roleId: string;
    assignedById: string;
    createdAt: Date;
    updatedAt: Date;
    user: RoleAssignmentUserDto;
    role: RoleAssignmentRoleDto;
}
export declare class AssignRoleResponseDto {
    message: string;
    assignment: RoleAssignmentDto;
}
export declare class UserRoleItemDto {
    assignmentId: string;
    roleId: string;
    roleName: string;
    description: string | null;
    isSystem: boolean;
    assignedAt: Date;
    assignedBy: RoleAssignmentUserDto | null;
}
export declare class UserBasicDto {
    id: string;
    email: string;
    fullName: string;
}
export declare class UserRolesResponseDto {
    user: UserBasicDto;
    roles: UserRoleItemDto[];
}
