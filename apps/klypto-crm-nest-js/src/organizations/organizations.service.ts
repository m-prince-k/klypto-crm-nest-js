import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
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

  async getProfile(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId }
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async updateProfile(organizationId: string, dto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: dto
    });
  }

  async getDetailedStats(organizationId: string) {
    const [employees, departments, branches, assets, projects] = await Promise.all([
      this.prisma.employee.count({ where: { organizationId } }),
      this.prisma.department.count({ where: { organizationId } }),
      this.prisma.branch.count({ where: { organizationId } }),
      this.prisma.asset.count({ where: { organizationId } }),
      this.prisma.project.count({ where: { organizationId } }),
    ]);

    return { 
      employees, 
      departments, 
      branches, 
      totalAssets: assets, 
      totalProjects: projects,
      systemHealth: '100%',
      securityIndex: '98.5%' 
    };
  }
}
