import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto, CreateLeadNoteDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
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
    return this.prisma.lead.findMany({
      where: { organizationId },
      include: { 
        assignee: {
          select: { id: true, fullName: true, email: true }
        },
        _count: {
          select: { notes: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, organizationId },
      include: { 
        assignee: {
          select: { id: true, fullName: true, email: true }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      },
    });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async create(organizationId: string, dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        ...dto,
        organizationId,
      },
      include: { assignee: true },
    });
  }

  async update(organizationId: string, id: string, dto: UpdateLeadDto) {
    await this.findOne(organizationId, id);
    return this.prisma.lead.update({
      where: { id },
      data: dto,
      include: { assignee: true },
    });
  }

  async delete(organizationId: string, id: string) {
    await this.findOne(organizationId, id);
    return this.prisma.lead.delete({
      where: { id },
    });
  }

  async addNote(organizationId: string, leadId: string, dto: CreateLeadNoteDto) {
    await this.findOne(organizationId, leadId);
    return this.prisma.leadNote.create({
      data: {
        content: dto.content,
        leadId,
      },
    });
  }

  async getNotes(organizationId: string, leadId: string) {
    await this.findOne(organizationId, leadId);
    return this.prisma.leadNote.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
