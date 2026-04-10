import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
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

  async findAll(organizationId: string) {
    return this.prisma.leaveRequest.findMany({
      where: { organizationId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(organizationId: string, dto: CreateLeaveDto) {
    console.log('Creating leave request:', { organizationId, dto });
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
      include: { employee: true },
    });
  }

  async updateStatus(organizationId: string, id: string, dto: UpdateLeaveStatusDto) {
    const leave = await this.prisma.leaveRequest.findFirst({
      where: { id, organizationId },
    });
    if (!leave) throw new NotFoundException('Leave request not found');

    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: dto.status },
      include: { employee: true },
    });
  }
}
