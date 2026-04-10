import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaveDto, UpdateLeaveStatusDto } from './dto/leave.dto';

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
    return employee?.id ?? null;
  }
}
