import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePolicyDto, UpdatePolicyDto } from './dto/policy.dto';

@Injectable()
export class PoliciesService {
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
    return this.prisma.policy.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(organizationId: string, id: string) {
    const policy = await this.prisma.policy.findFirst({
      where: { id, organizationId },
    });
    if (!policy) throw new NotFoundException('Policy not found');
    return policy;
  }

  async create(organizationId: string, dto: CreatePolicyDto) {
    return this.prisma.policy.create({
      data: {
        title: dto.title,
        content: dto.content,
        category: dto.category || 'General',
        organization: { connect: { id: organizationId } },
      },
    });
  }

  async update(organizationId: string, id: string, dto: UpdatePolicyDto) {
    const policy = await this.prisma.policy.findFirst({
      where: { id, organizationId },
    });
    if (!policy) throw new NotFoundException('Policy not found');

    return this.prisma.policy.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
      },
    });
  }

  async remove(organizationId: string, id: string) {
    const policy = await this.prisma.policy.findFirst({
      where: { id, organizationId },
    });
    if (!policy) throw new NotFoundException('Policy not found');

    return this.prisma.policy.delete({
      where: { id },
    });
  }
}
