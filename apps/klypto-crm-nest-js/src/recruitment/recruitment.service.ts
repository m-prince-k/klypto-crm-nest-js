import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobPostingDto, UpdateJobPostingDto, CreateCandidateDto, UpdateCandidateDto } from './dto/recruitment.dto';

@Injectable()
export class RecruitmentService {
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

  // Job Postings
  async findAllJobs(organizationId: string) {
    return this.prisma.jobPosting.findMany({
      where: { organizationId },
      include: { _count: { select: { candidates: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createJob(organizationId: string, dto: CreateJobPostingDto) {
    return this.prisma.jobPosting.create({
      data: { ...dto, organizationId },
    });
  }

  async updateJob(organizationId: string, id: string, dto: UpdateJobPostingDto) {
    const job = await this.prisma.jobPosting.findFirst({ where: { id, organizationId } });
    if (!job) throw new NotFoundException('Job posting not found');
    return this.prisma.jobPosting.update({ where: { id }, data: dto });
  }

  // Candidates
  async findAllCandidates(organizationId: string) {
    return this.prisma.candidate.findMany({
      where: { organizationId },
      include: { job: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createCandidate(organizationId: string, dto: CreateCandidateDto) {
    return this.prisma.candidate.create({
      data: { ...dto, organizationId },
      include: { job: true },
    });
  }

  async updateCandidate(organizationId: string, id: string, dto: UpdateCandidateDto) {
    const candidate = await this.prisma.candidate.findFirst({ where: { id, organizationId } });
    if (!candidate) throw new NotFoundException('Candidate not found');

    const updatedCandidate = await this.prisma.candidate.update({
      where: { id },
      data: dto,
      include: { job: true },
    });

    // Auto-onboard logic if status is changed to Hired
    if (dto.stage === 'Hired' && candidate.stage !== 'Hired') {
      await this.onboardCandidate(organizationId, updatedCandidate);
    }

    return updatedCandidate;
  }

  private async onboardCandidate(organizationId: string, candidate: any) {
    // Generate a simple employee code if not present
    const code = `EMP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    // Check if employee already exists to prevent duplicates
    const existing = await this.prisma.employee.findFirst({
      where: { name: candidate.name, organizationId }
    });

    if (!existing) {
      await this.prisma.employee.create({
        data: {
          name: candidate.name,
          role: candidate.role,
          department: candidate.job?.department || 'General',
          code,
          status: 'Active',
          organizationId,
        }
      });
    }
  }

  async deleteCandidate(organizationId: string, id: string) {
    const candidate = await this.prisma.candidate.findFirst({ where: { id, organizationId } });
    if (!candidate) throw new NotFoundException('Candidate not found');
    return this.prisma.candidate.delete({ where: { id } });
  }
}
