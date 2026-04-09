import {
  Body,
  Controller,
  Get,
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
  RoleResponseDto,
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
}
