import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SystemRole } from '../auth/roles/system-role.enum';
import { PrismaService } from '../prisma/prisma.service';
import {
  AssignRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  UserWithRolesDto,
} from './dto/rbac.dto';

const DEFAULT_DASHBOARD_MODULES = [
  'dashboard',
  'leads',
  'erp',
  'recruitment',
  'grievances',
  'payroll',
  'hrms',
  'leave',
  'employees',
  'settings',
  'roles-access',
];

const DASHBOARD_MODULE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  erp: 'ERP Portal',
  recruitment: 'Recruitment',
  grievances: 'Grievances',
  payroll: 'Payroll',
  hrms: 'HR',
  leave: 'Leave',
  employees: 'Employees',
  settings: 'Settings',
  'roles-access': 'Roles & Access',
};

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(dto: CreateRoleDto) {
    const roleName = dto.name.trim().toUpperCase();
    const dashboardModules = this.normalizeDashboardModules(
      dto.dashboardModules,
    );

    const existingRole = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    return this.prisma.role.create({
      data: {
        name: roleName,
        description: dto.description,
        isSystem: false,
        dashboardModules,
      },
    });
  }

  async listRoles() {
    const roles = await this.prisma.role.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { assignments: true },
        },
      },
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      isSystem: role.isSystem,
      assignedUsersCount: role._count.assignments,
      dashboardModules: role.dashboardModules,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));
  }

  listDashboardModules() {
    return DEFAULT_DASHBOARD_MODULES.map((key) => ({
      key,
      label: DASHBOARD_MODULE_LABELS[key] ?? key,
      description: this.getDashboardModuleDescription(key),
    }));
  }

  async updateRole(roleId: string, dto: UpdateRoleDto) {
    const existingRole = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      throw new NotFoundException('Role not found');
    }

    const hasNameUpdate =
      typeof dto.name === 'string' && dto.name.trim().length > 0;
    const hasDescriptionUpdate = typeof dto.description === 'string';
    const hasModulesUpdate = Array.isArray(dto.dashboardModules);

    if (!hasNameUpdate && !hasDescriptionUpdate && !hasModulesUpdate) {
      throw new BadRequestException(
        'Provide name, description or dashboard modules to update',
      );
    }

    const nextName = hasNameUpdate
      ? dto.name!.trim().toUpperCase()
      : existingRole.name;

    if (
      existingRole.isSystem &&
      hasNameUpdate &&
      nextName !== existingRole.name
    ) {
      throw new ConflictException('System role name cannot be changed');
    }

    const dashboardModules = hasModulesUpdate
      ? this.normalizeDashboardModules(dto.dashboardModules)
      : existingRole.dashboardModules;

    if (hasNameUpdate && nextName !== existingRole.name) {
      const conflictingRole = await this.prisma.role.findUnique({
        where: { name: nextName },
      });

      if (conflictingRole && conflictingRole.id !== roleId) {
        throw new ConflictException('Role already exists');
      }
    }

    return this.prisma.role
      .update({
        where: { id: roleId },
        data: {
          name: nextName,
          description: hasDescriptionUpdate
            ? dto.description
            : existingRole.description,
          dashboardModules,
        },
        include: {
          _count: {
            select: { assignments: true },
          },
        },
      })
      .then((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        assignedUsersCount: role._count.assignments,
        dashboardModules: role.dashboardModules,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }));
  }

  async deleteRole(roleId: string) {
    const existingRole = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        _count: {
          select: { assignments: true },
        },
      },
    });

    if (!existingRole) {
      throw new NotFoundException('Role not found');
    }

    if (existingRole.isSystem) {
      throw new ConflictException('System roles cannot be deleted');
    }

    if (existingRole._count.assignments > 0) {
      throw new ConflictException(
        'Role is assigned to users and cannot be deleted',
      );
    }

    await this.prisma.role.delete({ where: { id: roleId } });

    return { message: 'Role deleted successfully' };
  }

  async assignRole(dto: AssignRoleDto, assignedById: string) {
    const roleName = dto.roleName.trim().toUpperCase();

    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const assignment = await this.prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
      update: {
        assignedById,
      },
      create: {
        userId: user.id,
        roleId: role.id,
        assignedById,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        role: true,
      },
    });

    return {
      message: 'Role assigned successfully',
      assignment,
    };
  }

  async getUserRoles(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleAssignments: {
          include: {
            role: true,
            assignedBy: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      roles: user.roleAssignments.map((assignment) => ({
        assignmentId: assignment.id,
        roleId: assignment.role.id,
        roleName: assignment.role.name,
        description: assignment.role.description,
        isSystem: assignment.role.isSystem,
        dashboardModules: assignment.role.dashboardModules,
        assignedAt: assignment.createdAt,
        assignedBy: assignment.assignedBy,
      })),
    };
  }

  async listUsersWithRoles(): Promise<UserWithRolesDto[]> {
    const users = await this.prisma.user.findMany({
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        roleAssignments: {
          include: {
            role: {
              select: {
                name: true,
                dashboardModules: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => {
      const roles = user.roleAssignments.map(
        (assignment) => assignment.role.name,
      );
      const hasSuperAdmin = roles.includes(SystemRole.SUPER_ADMIN);
      const hasAdmin = roles.includes(SystemRole.ADMIN);

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        organizationId: user.organizationId,
        organizationName: user.organization.name,
        isActive: user.isActive,
        roles,
        dashboardModules: [
          ...new Set(
            user.roleAssignments.flatMap(
              (assignment) => assignment.role.dashboardModules || [],
            ),
          ),
        ],
        access: {
          isSuperAdmin: hasSuperAdmin,
          canManageUsers: hasSuperAdmin || hasAdmin,
          canManageRbac: hasSuperAdmin,
          canViewDashboard: hasSuperAdmin || roles.length > 0,
          dashboardModules: [
            ...new Set(
              user.roleAssignments.flatMap(
                (assignment) => assignment.role.dashboardModules || [],
              ),
            ),
          ],
        },
        createdAt: user.createdAt,
      };
    });
  }

  private getDashboardModuleDescription(key: string) {
    switch (key) {
      case 'dashboard':
        return 'Executive summary cards and insights';
      case 'leads':
        return 'Lead and pipeline tracking';
      case 'erp':
        return 'Finance, procurement, and ERP workflows';
      case 'recruitment':
        return 'Hiring and assessment workflows';
      case 'grievances':
        return 'Employee grievance management';
      case 'payroll':
        return 'Salary and compensation management';
      case 'hrms':
        return 'HR overview and operations';
      case 'leave':
        return 'Leave requests and approvals';
      case 'employees':
        return 'Employee master and directory';
      case 'settings':
        return 'Personal account and preferences';
      case 'roles-access':
        return 'Role and access administration';
      default:
        return 'Dashboard module';
    }
  }

  private normalizeDashboardModules(modules?: string[]) {
    const normalized = [
      ...new Set(
        (modules ?? []).map((module) => module.trim()).filter(Boolean),
      ),
    ];

    if (!normalized.includes('dashboard')) {
      normalized.unshift('dashboard');
    }

    return normalized;
  }
}
