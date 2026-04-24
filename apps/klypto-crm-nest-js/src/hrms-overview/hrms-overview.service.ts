import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HrmsOverviewService {
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

  async getStats(organizationId: string) {
    const [
      totalEmployees,
      pendingLeaves,
      activeEmployees,
      structuresCount,
      attendanceToday,
    ] = await Promise.all([
      this.prisma.employee.count({ where: { organizationId } }),
      this.prisma.leaveRequest.count({
        where: { organizationId, status: 'Pending' },
      }),
      this.prisma.employee.count({
        where: { organizationId, status: { in: ['Active', 'Onboarding'] } },
      }),
      this.prisma.salaryStructure.count({ where: { organizationId } }),
      this.prisma.attendanceRecord.count({
        where: {
          organizationId,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          status: 'Present',
        },
      }),
    ]);

    const attendanceRate =
      activeEmployees > 0 ? (attendanceToday / activeEmployees) * 100 : 0;
    const payrollReady =
      totalEmployees > 0 ? (structuresCount / totalEmployees) * 100 : 0;

    return {
      totalEmployees,
      attendanceRate: attendanceRate.toFixed(1) + '%',
      pendingLeaves,
      payrollReady: payrollReady.toFixed(0) + '%',
    };
  }
}
