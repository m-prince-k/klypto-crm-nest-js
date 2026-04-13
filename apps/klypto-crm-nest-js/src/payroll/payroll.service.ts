import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalaryStructureDto, ProcessPayrollDto } from './dto/payroll.dto';

@Injectable()
export class PayrollService {
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
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [structures, records, recordsThisMonth] = await Promise.all([
      this.prisma.salaryStructure.count({ where: { organizationId } }),
      this.prisma.payrollRecord.findMany({
        where: { organizationId, month, year },
        include: { employee: { select: { name: true } } },
      }),
      this.prisma.payrollRecord.findMany({
        where: { organizationId, month, year },
      }),
    ]);

    const totalNetPay = recordsThisMonth.reduce((sum, r) => sum + r.netPay, 0);
    const paidCount = recordsThisMonth.filter((r) => r.status === 'Paid').length;

    return {
      employeesOnPayroll: structures,
      totalNetPayThisMonth: totalNetPay,
      processedRecords: paidCount,
      pendingRecords: structures - paidCount,
      currentMonth: month,
      currentYear: year,
      recentRecords: records.slice(0, 5),
    };
  }

  async findStructures(organizationId: string) {
    return this.prisma.salaryStructure.findMany({
      where: { organizationId },
      include: { employee: { select: { id: true, name: true, code: true, department: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertStructure(organizationId: string, dto: CreateSalaryStructureDto) {
    return this.prisma.salaryStructure.upsert({
      where: { employeeId: dto.employeeId },
      create: {
        basicSalary: dto.basicSalary,
        hra: dto.hra,
        allowances: dto.allowances,
        deductions: dto.deductions,
        employee: { connect: { id: dto.employeeId } },
        organization: { connect: { id: organizationId } },
      },
      update: {
        basicSalary: dto.basicSalary,
        hra: dto.hra,
        allowances: dto.allowances,
        deductions: dto.deductions,
      },
      include: { employee: { select: { id: true, name: true, code: true, department: true, role: true } } },
    });
  }

  async findAllRecords(organizationId: string) {
    return this.prisma.payrollRecord.findMany({
      where: { organizationId },
      include: { employee: { select: { id: true, name: true, code: true, department: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async processPayroll(organizationId: string, dto: ProcessPayrollDto) {
    const structures = await this.prisma.salaryStructure.findMany({
      where: { organizationId },
      include: { employee: { select: { id: true, name: true } } },
    });

    if (structures.length === 0) {
      return [];
    }

    const records = [];
    for (const struct of structures) {
      const netPay = struct.basicSalary + struct.hra + struct.allowances - struct.deductions;

      const record = await this.prisma.payrollRecord.upsert({
        where: {
          employeeId_month_year: {
            employeeId: struct.employeeId,
            month: dto.month,
            year: dto.year,
          },
        },
        create: {
          employeeId: struct.employeeId,
          month: dto.month,
          year: dto.year,
          netPay,
          status: 'Paid',
          organizationId,
        },
        update: { netPay, status: 'Paid' },
        include: { employee: { select: { id: true, name: true } } },
      });
      records.push(record);
    }
    return records;
  }
}
