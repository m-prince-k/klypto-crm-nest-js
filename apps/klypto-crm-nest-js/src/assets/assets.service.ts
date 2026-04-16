import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';

@Injectable()
export class AssetsService {
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
    return this.prisma.asset.findMany({
      where: { organizationId },
      include: {
        employee: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(organizationId: string, dto: CreateAssetDto) {
    return this.prisma.asset.create({
      data: { ...dto, organizationId },
    });
  }

  async update(organizationId: string, id: string, dto: UpdateAssetDto) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, organizationId },
    });
    if (!asset) throw new NotFoundException('Asset not found');

    return this.prisma.asset.update({
      where: { id },
      data: dto,
    });
  }

  async delete(organizationId: string, id: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, organizationId },
    });
    if (!asset) throw new NotFoundException('Asset not found');

    return this.prisma.asset.delete({
      where: { id },
    });
  }

  async getStats(organizationId: string) {
    const assets = await this.prisma.asset.findMany({
      where: { organizationId },
    });

    const totalValuation = assets.reduce((sum, a) => sum + (a.value || 0), 0);
    const inUse = assets.filter((a) => a.status === 'In Use').length;
    const maintenance = assets.filter((a) => a.status === 'Maintenance').length;

    return { total: assets.length, totalValuation, inUse, maintenance };
  }
}
