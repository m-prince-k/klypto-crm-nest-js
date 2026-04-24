import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResignationDto, UpdateResignationStatusDto } from './dto/resignation.dto';

@Injectable()
export class ResignationService {
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

  async create(organizationId: string, dto: CreateResignationDto) {
    const existing = await this.prisma.resignation.findUnique({
      where: { employeeId: dto.employeeId },
    });

    if (existing && existing.status !== 'Withdrawn' && existing.status !== 'Rejected') {
      throw new ConflictException('A resignation request is already active for this employee.');
    }

    return this.prisma.resignation.upsert({
      where: { employeeId: dto.employeeId },
      update: {
        ...dto,
        organizationId,
        status: 'Pending',
        fnfStatus: 'Pending',
        submissionDate: new Date(),
        proposedLastWorkingDay: new Date(dto.proposedLastWorkingDay),
      },
      create: {
        ...dto,
        organizationId,
        proposedLastWorkingDay: new Date(dto.proposedLastWorkingDay),
      },
      include: { employee: { select: { name: true, code: true } } },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.resignation.findMany({
      where: { organizationId },
      include: { employee: { select: { name: true, code: true, department: true, role: true } } },
      orderBy: { submissionDate: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const resignation = await this.prisma.resignation.findFirst({
      where: { id, organizationId },
      include: { employee: { select: { name: true, code: true } } },
    });

    if (!resignation) throw new NotFoundException('Resignation request not found');
    return resignation;
  }

  async updateStatus(organizationId: string, id: string, dto: UpdateResignationStatusDto) {
    const resignation = await this.findOne(organizationId, id);

    const updated = await this.prisma.resignation.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.fnfStatus && { fnfStatus: dto.fnfStatus }),
        ...(dto.companyAssetsHandover !== undefined && { companyAssetsHandover: dto.companyAssetsHandover }),
      },
    });
    
    return updated;
  }
}
