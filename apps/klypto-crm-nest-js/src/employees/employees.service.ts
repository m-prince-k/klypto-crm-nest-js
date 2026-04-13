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
      throw new ConflictException(`Employee with code ${dto.code} already exists`);
    }

    return this.prisma.employee.create({
      data: {
        name: dto.name,
        code: dto.code,
        role: dto.role,
        department: dto.department,
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
        throw new ConflictException(`Employee with code ${dto.code} already exists`);
      }
    }

    return this.prisma.employee.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        role: dto.role,
        department: dto.department,
        status: dto.status,
        ...(dto.userId && { user: { connect: { id: dto.userId } } }),
      },
    });
  }

  async remove(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    await this.prisma.employee.delete({
      where: { id },
    });
    return { message: 'Employee deleted successfully' };
  }
}
