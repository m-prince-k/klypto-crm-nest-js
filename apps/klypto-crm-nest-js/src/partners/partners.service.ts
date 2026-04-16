import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';

@Injectable()
export class PartnersService {
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

  async findAll(organizationId: string, type?: string) {
    return this.prisma.partner.findMany({
      where: {
        organizationId,
        ...(type && { type }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(organizationId: string, dto: CreatePartnerDto) {
    return this.prisma.partner.create({
      data: { ...dto, organizationId },
    });
  }

  async update(organizationId: string, id: string, dto: UpdatePartnerDto) {
    const partner = await this.prisma.partner.findFirst({
      where: { id, organizationId },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    return this.prisma.partner.update({
      where: { id },
      data: dto,
    });
  }

  async delete(organizationId: string, id: string) {
    const partner = await this.prisma.partner.findFirst({
      where: { id, organizationId },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    return this.prisma.partner.delete({ where: { id } });
  }

  async getStats(organizationId: string) {
    const [customers, vendors] = await Promise.all([
      this.prisma.partner.count({
        where: { organizationId, type: 'CUSTOMER' },
      }),
      this.prisma.partner.count({ where: { organizationId, type: 'VENDOR' } }),
    ]);

    return { customers, vendors };
  }
}
