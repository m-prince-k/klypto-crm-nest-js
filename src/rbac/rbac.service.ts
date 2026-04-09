import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignRoleDto, CreateRoleDto } from './dto/rbac.dto';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(dto: CreateRoleDto) {
    const roleName = dto.name.trim().toUpperCase();

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
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }));
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
        assignedAt: assignment.createdAt,
        assignedBy: assignment.assignedBy,
      })),
    };
  }
}
