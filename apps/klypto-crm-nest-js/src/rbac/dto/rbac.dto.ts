import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'SALES_MANAGER',
    description: 'Unique role name (stored as uppercase)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'Role for managing sales operations',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ['dashboard', 'hrms', 'leave'],
    required: false,
    description: 'Dashboard modules assigned to the role',
    type: [String],
  })
  @IsOptional()
  dashboardModules?: string[];
}

export class AssignRoleDto {
  @ApiProperty({
    example: 'ckxxxxxxxxxxxxxxxxxxxxxxx',
    description: 'User ID receiving the role',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'SALES_MANAGER',
    description: 'Role name to assign',
  })
  @IsString()
  @IsNotEmpty()
  roleName: string;
}

export class UpdateRoleDto {
  @ApiProperty({
    example: 'SALES_MANAGER',
    required: false,
    description: 'Updated role name (stored as uppercase)',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({
    example: 'Updated role description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: ['dashboard', 'hrms', 'leave'],
    required: false,
    description: 'Updated dashboard modules assigned to the role',
    type: [String],
  })
  @IsOptional()
  dashboardModules?: string[];
}

export class RoleResponseDto {
  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ example: 'SALES_MANAGER' })
  name: string;

  @ApiProperty({
    example: 'Role for managing sales operations',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: false })
  isSystem: boolean;

  @ApiProperty({ example: 12 })
  assignedUsersCount: number;

  @ApiProperty({
    example: ['dashboard', 'hrms', 'leave'],
    type: [String],
  })
  dashboardModules: string[];

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-02T10:00:00.000Z' })
  updatedAt: Date;
}

export class RoleAssignmentUserDto {
  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ example: 'john.doe@company.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;
}

export class RoleAssignmentRoleDto {
  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ example: 'SALES_MANAGER' })
  name: string;

  @ApiProperty({
    example: 'Role for managing sales operations',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: false })
  isSystem: boolean;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-02T10:00:00.000Z' })
  updatedAt: Date;
}

export class RoleAssignmentDto {
  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  userId: string;

  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  roleId: string;

  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  assignedById: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-02T10:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: RoleAssignmentUserDto })
  user: RoleAssignmentUserDto;

  @ApiProperty({ type: RoleAssignmentRoleDto })
  role: RoleAssignmentRoleDto;
}

export class AssignRoleResponseDto {
  @ApiProperty({ example: 'Role assigned successfully' })
  message: string;

  @ApiProperty({ type: RoleAssignmentDto })
  assignment: RoleAssignmentDto;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Role deleted successfully' })
  message: string;
}

export class UserRoleItemDto {
  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  assignmentId: string;

  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  roleId: string;

  @ApiProperty({ example: 'SALES_MANAGER' })
  roleName: string;

  @ApiProperty({
    example: 'Role for managing sales operations',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: false })
  isSystem: boolean;

  @ApiProperty({
    example: ['dashboard', 'hrms', 'leave'],
    type: [String],
  })
  dashboardModules: string[];

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  assignedAt: Date;

  @ApiProperty({ type: RoleAssignmentUserDto, nullable: true })
  assignedBy: RoleAssignmentUserDto | null;
}

export class UserBasicDto {
  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ example: 'john.doe@company.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;
}

export class UserRolesResponseDto {
  @ApiProperty({ type: UserBasicDto })
  user: UserBasicDto;

  @ApiProperty({ type: [UserRoleItemDto] })
  roles: UserRoleItemDto[];
}

export class UserAccessDto {
  @ApiProperty({ example: false })
  isSuperAdmin: boolean;

  @ApiProperty({ example: true })
  canManageUsers: boolean;

  @ApiProperty({ example: false })
  canManageRbac: boolean;

  @ApiProperty({ example: true })
  canViewDashboard: boolean;

  @ApiProperty({
    example: ['dashboard', 'hrms', 'leave'],
    type: [String],
  })
  dashboardModules: string[];
}

export class UserWithRolesDto {
  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  id: string;

  @ApiProperty({ example: 'john.doe@company.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'ckxxxxxxxxxxxxxxxxxxxxxxx' })
  organizationId: string;

  @ApiProperty({ example: 'Klypto Corp' })
  organizationName: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: [String], example: ['EMPLOYEE'] })
  roles: string[];

  @ApiProperty({ type: [String], example: ['dashboard', 'hrms', 'leave'] })
  dashboardModules: string[];

  @ApiProperty({ type: UserAccessDto })
  access: UserAccessDto;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: Date;
}
