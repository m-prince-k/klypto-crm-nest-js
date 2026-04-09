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
