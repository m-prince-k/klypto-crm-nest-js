import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { SystemRole } from '../auth/roles/system-role.enum';
import {
  AssignRoleDto,
  AssignRoleResponseDto,
  CreateRoleDto,
  MessageResponseDto,
  RoleResponseDto,
  UpdateRoleDto,
  UserWithRolesDto,
  UserRolesResponseDto,
} from './dto/rbac.dto';
import { RbacService } from './rbac.service';

@ApiTags('RBAC')
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(SystemRole.SUPER_ADMIN)
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post('roles')
  @ApiOperation({ summary: 'Create a new role (Super Admin only)' })
  @ApiBody({ type: CreateRoleDto })
  @ApiCreatedResponse({
    description: 'Role created successfully',
    type: RoleResponseDto,
  })
  @ApiConflictResponse({ description: 'Role already exists' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(dto);
  }

  @Get('roles')
  @ApiOperation({ summary: 'List all roles (Super Admin only)' })
  @ApiOkResponse({
    description: 'Roles fetched successfully',
    type: [RoleResponseDto],
  })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  listRoles() {
    return this.rbacService.listRoles();
  }

  @Patch('roles/:roleId')
  @ApiOperation({ summary: 'Update an existing role (Super Admin only)' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponse({
    description: 'Role updated successfully',
    type: RoleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiConflictResponse({ description: 'Role already exists or immutable' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  updateRole(@Param('roleId') roleId: string, @Body() dto: UpdateRoleDto) {
    return this.rbacService.updateRole(roleId, dto);
  }

  @Delete('roles/:roleId')
  @ApiOperation({ summary: 'Delete a role (Super Admin only)' })
  @ApiOkResponse({
    description: 'Role deleted successfully',
    type: MessageResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiConflictResponse({ description: 'Role cannot be deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  deleteRole(@Param('roleId') roleId: string) {
    return this.rbacService.deleteRole(roleId);
  }

  @Post('roles/assign')
  @ApiOperation({ summary: 'Assign role to user (Super Admin only)' })
  @ApiBody({ type: AssignRoleDto })
  @ApiOkResponse({
    description: 'Role assigned successfully',
    type: AssignRoleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User or role not found' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Invalid user context' })
  assignRole(
    @Body() dto: AssignRoleDto,
    @Req() req: { user?: { sub?: string } },
  ) {
    const assignedById = req.user?.sub;
    if (!assignedById) {
      throw new UnauthorizedException('Invalid user context');
    }

    return this.rbacService.assignRole(dto, assignedById);
  }

  @Get('users/:userId/roles')
  @ApiOperation({ summary: 'Get all roles for a user (Super Admin only)' })
  @ApiOkResponse({
    description: 'User roles fetched successfully',
    type: UserRolesResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getUserRoles(@Param('userId') userId: string) {
    return this.rbacService.getUserRoles(userId);
  }

  @Get('users')
  @ApiOperation({
    summary: 'List all users with roles and access (Super Admin only)',
  })
  @ApiOkResponse({
    description: 'Users fetched successfully',
    type: [UserWithRolesDto],
  })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  listUsersWithRoles() {
    return this.rbacService.listUsersWithRoles();
  }
}
