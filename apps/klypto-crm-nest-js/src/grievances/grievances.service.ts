import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGrievanceDto, UpdateGrievanceDto } from './dto/grievance.dto';

@Injectable()
export class GrievancesService {
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

  async findAll(organizationId: string) {
    const grievances = await this.prisma.grievance.findMany({
      where: { organizationId },
      include: {
        employee: {
          select: { id: true, name: true, department: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Mask employee info if anonymous (unless context is super-admin/HR)
    return grievances.map(g => {
      if (g.isAnonymous) {
        return { ...g, employee: null };
      }
      return g;
    });
  }

  async create(organizationId: string, dto: CreateGrievanceDto) {
    return this.prisma.grievance.create({
      data: { ...dto, organizationId },
    });
  }

  async update(organizationId: string, id: string, dto: UpdateGrievanceDto) {
    const grievance = await this.prisma.grievance.findFirst({ where: { id, organizationId } });
    if (!grievance) throw new NotFoundException('Grievance not found');

    return this.prisma.grievance.update({
      where: { id },
      data: dto,
    });
  }

  async getStats(organizationId: string) {
    const [total, unresolved, critical, resolved] = await Promise.all([
      this.prisma.grievance.count({ where: { organizationId } }),
      this.prisma.grievance.count({ where: { organizationId, status: { not: 'Resolved' } } }),
      this.prisma.grievance.count({ where: { organizationId, severity: { in: ['High', 'Critical'] }, status: { not: 'Resolved' } } }),
      this.prisma.grievance.count({ 
        where: { 
          organizationId, 
          status: 'Resolved',
          updatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } // MTD (Month to Date)
        } 
      }),
    ]);

    return { total, unresolved, critical, resolved };
  }

  async findRecent(organizationId: string) {
    return this.prisma.grievance.findMany({
      where: { organizationId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
  }
}
