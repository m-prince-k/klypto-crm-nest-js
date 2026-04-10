import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto, CreateDepartmentDto, UpdateDepartmentDto } from './dto/entities.dto';

@Injectable()
export class EntitiesService {
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

  // Branches
  async findAllBranches(organizationId: string) {
    return this.prisma.branch.findMany({
      where: { organizationId },
      include: { 
        head: { select: { id: true, name: true } },
        _count: { select: { departments: true, employees: true } }
      },
      orderBy: { name: 'asc' },
    });
  }

  async createBranch(organizationId: string, dto: CreateBranchDto) {
    return this.prisma.branch.create({
      data: { ...dto, organizationId },
    });
  }

  async updateBranch(organizationId: string, id: string, dto: UpdateBranchDto) {
    const branch = await this.prisma.branch.findFirst({ where: { id, organizationId } });
    if (!branch) throw new NotFoundException('Branch not found');
    return this.prisma.branch.update({ where: { id }, data: dto });
  }

  // Departments
  async findAllDepartments(organizationId: string, branchId?: string) {
    return this.prisma.department.findMany({
      where: { 
        organizationId,
        ...(branchId && { branchId })
      },
      include: { 
        head: { select: { id: true, name: true } },
        branch: { select: { name: true } },
        _count: { select: { employees: true } }
      },
      orderBy: { name: 'asc' },
    });
  }

  async createDepartment(organizationId: string, dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: { ...dto, organizationId },
    });
  }

  async updateDepartment(organizationId: string, id: string, dto: UpdateDepartmentDto) {
    const department = await this.prisma.department.findFirst({ where: { id, organizationId } });
    if (!department) throw new NotFoundException('Department not found');
    return this.prisma.department.update({ where: { id }, data: dto });
  }

  async getStats(organizationId: string) {
    const [branches, departments, employees] = await Promise.all([
      this.prisma.branch.count({ where: { organizationId } }),
      this.prisma.department.count({ where: { organizationId } }),
      this.prisma.employee.count({ where: { organizationId } }),
    ]);

    return { branches, departments, employees };
  }
}
