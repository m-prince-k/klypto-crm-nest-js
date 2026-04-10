import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerformanceReviewDto, UpdatePerformanceReviewDto } from './dto/performance.dto';

@Injectable()
export class PerformanceService {
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
    return this.prisma.performanceReview.findMany({
      where: { organizationId },
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(organizationId: string, dto: CreatePerformanceReviewDto) {
    return this.prisma.performanceReview.create({
      data: {
        ...dto,
        organizationId,
      },
      include: { employee: true },
    });
  }

  async update(organizationId: string, id: string, dto: UpdatePerformanceReviewDto) {
    const review = await this.prisma.performanceReview.findFirst({
      where: { id, organizationId },
    });
    if (!review) throw new NotFoundException('Performance review not found');

    return this.prisma.performanceReview.update({
      where: { id },
      data: { ...dto },
      include: { employee: true },
    });
  }
}
