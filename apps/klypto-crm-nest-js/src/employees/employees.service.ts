import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeesService {
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

  async create(organizationId: string, dto: CreateEmployeeDto) {
    const existing = await this.prisma.employee.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(
        `Employee with code ${dto.code} already exists`,
      );
    }

    return this.prisma.employee.create({
      data: {
        name: dto.name,
        code: dto.code,
        role: dto.role,
        department: dto.department,
        ...(dto.departmentId?.trim()
          ? { dept: { connect: { id: dto.departmentId } } }
          : {}),
        ...(dto.branchId?.trim()
          ? { branch: { connect: { id: dto.branchId } } }
          : {}),
        status: dto.status || 'Active',
        organization: { connect: { id: organizationId } },
        ...(dto.userId && { user: { connect: { id: dto.userId } } }),
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.employee.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, organizationId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(organizationId: string, id: string, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(organizationId, id);

    if (dto.code && dto.code !== employee.code) {
      const existing = await this.prisma.employee.findUnique({
        where: { code: dto.code },
      });
      if (existing) {
        throw new ConflictException(
          `Employee with code ${dto.code} already exists`,
        );
      }
    }

    return this.prisma.employee.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        role: dto.role,
        department: dto.department,
        ...(dto.departmentId !== undefined
          ? {
              dept: dto.departmentId?.trim()
                ? { connect: { id: dto.departmentId } }
                : { disconnect: true },
            }
          : {}),
        ...(dto.branchId !== undefined
          ? {
              branch: dto.branchId?.trim()
                ? { connect: { id: dto.branchId } }
                : { disconnect: true },
            }
          : {}),
        status: dto.status,
        ...(dto.userId && { user: { connect: { id: dto.userId } } }),
      },
    });
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    await this.prisma.$transaction([
      this.prisma.attendanceRecord.deleteMany({
        where: { organizationId, employeeId: id },
      }),
      this.prisma.leaveRequest.deleteMany({
        where: { organizationId, employeeId: id },
      }),
      this.prisma.salaryStructure.deleteMany({
        where: { organizationId, employeeId: id },
      }),
      this.prisma.payrollRecord.deleteMany({
        where: { organizationId, employeeId: id },
      }),
      this.prisma.performanceReview.deleteMany({
        where: { organizationId, employeeId: id },
      }),
      this.prisma.grievance.updateMany({
        where: { organizationId, employeeId: id },
        data: { employeeId: null },
      }),
      this.prisma.asset.updateMany({
        where: { organizationId, employeeId: id },
        data: { employeeId: null },
      }),
      this.prisma.branch.updateMany({
        where: { organizationId, headId: id },
        data: { headId: null },
      }),
      this.prisma.department.updateMany({
        where: { organizationId, headId: id },
        data: { headId: null },
      }),
      this.prisma.employee.delete({
        where: { id },
      }),
    ]);

    return { message: 'Employee deleted successfully' };
  }
}
