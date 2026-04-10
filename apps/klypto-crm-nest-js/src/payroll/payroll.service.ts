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

  async findStructures(organizationId: string) {
    return this.prisma.salaryStructure.findMany({
      where: { organizationId },
      include: { employee: true },
    });
  }

  async upsertStructure(organizationId: string, dto: CreateSalaryStructureDto) {
    return this.prisma.salaryStructure.upsert({
      where: { employeeId: dto.employeeId },
      create: {
        ...dto,
        organizationId,
      },
      update: {
        basicSalary: dto.basicSalary,
        hra: dto.hra,
        allowances: dto.allowances,
        deductions: dto.deductions,
      },
      include: { employee: true },
    });
  }

  async findAllRecords(organizationId: string) {
    return this.prisma.payrollRecord.findMany({
      where: { organizationId },
      include: { employee: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async processPayroll(organizationId: string, dto: ProcessPayrollDto) {
    const structures = await this.prisma.salaryStructure.findMany({
      where: { organizationId },
    });

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
        update: {
          netPay,
          status: 'Paid',
        },
      });
      records.push(record);
    }
    return records;
  }
}
