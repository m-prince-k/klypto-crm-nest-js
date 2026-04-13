import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateLeaveDto,
  UpdateLeaveDto,
  UpdateLeaveStatusDto,
} from './dto/leave.dto';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationId(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { organizationId: true },
    });
    if (!user || !user.organizationId) {
      throw new UnauthorizedException('Invalid user context');
    }
    return user.organizationId;
  }

  async findAll(organizationId: string, employeeId?: string) {
    return this.prisma.leaveRequest.findMany({
      where: {
        organizationId,
        ...(employeeId ? { employeeId } : {}),
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            code: true,
            role: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(organizationId: string, dto: CreateLeaveDto) {
    return this.prisma.leaveRequest.create({
      data: {
        type: dto.type,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        status: 'Pending',
        employee: { connect: { id: dto.employeeId } },
        organization: { connect: { id: organizationId } },
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            code: true,
            role: true,
            department: true,
          },
        },
      },
    });
  }

  async updateStatus(
    organizationId: string,
    id: string,
    dto: UpdateLeaveStatusDto,
  ) {
    const leave = await this.prisma.leaveRequest.findFirst({
      where: { id, organizationId },
    });
    if (!leave) throw new NotFoundException('Leave request not found');

    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: dto.status },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            code: true,
            role: true,
            department: true,
          },
        },
      },
    });
  }

  async updateLeave(organizationId: string, id: string, dto: UpdateLeaveDto) {
    const leave = await this.prisma.leaveRequest.findFirst({
      where: { id, organizationId },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!leave) throw new NotFoundException('Leave request not found');

    if (leave.status !== 'Pending') {
      throw new ForbiddenException('Only pending leave requests can be edited');
    }

    if (dto.employeeId) {
      const employee = await this.prisma.employee.findFirst({
        where: { id: dto.employeeId, organizationId },
        select: { id: true },
      });
      if (!employee) {
        throw new NotFoundException('Employee not found in organization');
      }
    }

    const nextStartDate = dto.startDate
      ? new Date(dto.startDate)
      : leave.startDate;
    const nextEndDate = dto.endDate ? new Date(dto.endDate) : leave.endDate;

    if (nextStartDate > nextEndDate) {
      throw new BadRequestException('Start date cannot be later than end date');
    }

    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
        ...(dto.reason !== undefined ? { reason: dto.reason } : {}),
        ...(dto.employeeId
          ? { employee: { connect: { id: dto.employeeId } } }
          : {}),
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            code: true,
            role: true,
            department: true,
          },
        },
      },
    });
  }

  async getStats(organizationId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, pending, approvedThisMonth, rejected] = await Promise.all([
      this.prisma.leaveRequest.count({ where: { organizationId } }),
      this.prisma.leaveRequest.count({
        where: { organizationId, status: 'Pending' },
      }),
      this.prisma.leaveRequest.count({
        where: {
          organizationId,
          status: 'Approved',
          updatedAt: { gte: startOfMonth },
        },
      }),
      this.prisma.leaveRequest.count({
        where: { organizationId, status: 'Rejected' },
      }),
    ]);

    // Leave type breakdown
    const byType = await this.prisma.leaveRequest.groupBy({
      by: ['type'],
      where: { organizationId },
      _count: { _all: true },
    });

    return {
      total,
      pending,
      approvedThisMonth,
      rejected,
      byType: byType.map((b) => ({ type: b.type, count: b._count._all })),
    };
  }

  async getEmployeeId(userId: string): Promise<string | null> {
    const employee = await this.prisma.employee.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (employee?.id) {
      return employee.id;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        organizationId: true,
        roleAssignments: {
          include: {
            role: { select: { name: true } },
          },
        },
      },
    });

    if (!user?.organizationId) {
      return null;
    }

    const hasSuperAdminRole = (user.roleAssignments || []).some(
      (assignment) =>
        String(assignment.role?.name).toUpperCase() === 'SUPER_ADMIN',
    );

    if (!hasSuperAdminRole) {
      return null;
    }

    const generatedCode = `ADM-${Date.now().toString(36).toUpperCase()}-${user.id
      .slice(-4)
      .toUpperCase()}`;

    const created = await this.prisma.employee.create({
      data: {
        name: user.fullName,
        code: generatedCode,
        role: 'SUPER_ADMIN',
        department: 'Administration',
        status: 'Active',
        organization: { connect: { id: user.organizationId } },
        user: { connect: { id: user.id } },
      },
      select: { id: true },
    });

    return created.id;
  }
}
